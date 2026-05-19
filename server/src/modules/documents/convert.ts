import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { env } from '../../config/env.js';

export const CONVERTIBLE_EXTENSIONS = new Set(['ppt', 'pptx']);

export function shouldConvertToPdf(ext: string): boolean {
  return CONVERTIBLE_EXTENSIONS.has(ext.toLowerCase());
}

export async function convertOfficeToPdf(inputPath: string): Promise<{
  outputPath: string;
  mimeType: string;
}> {
  const absInput = path.resolve(inputPath);
  if (!fs.existsSync(absInput)) {
    throw new Error(`Source file not found: ${absInput}`);
  }

  const outDir = path.dirname(absInput);
  const base = path.basename(absInput, path.extname(absInput));
  const expectedOut = path.join(outDir, `${base}.pdf`);

  await runLibreOffice(absInput, outDir);

  if (!fs.existsSync(expectedOut)) {
    throw new Error(`LibreOffice did not produce expected output: ${expectedOut}`);
  }

  return { outputPath: expectedOut, mimeType: 'application/pdf' };
}

function runLibreOffice(inputPath: string, outDir: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const args = ['--headless', '--norestore', '--nolockcheck', '--convert-to', 'pdf', '--outdir', outDir, inputPath];
    const child = spawn(env.libreOfficePath, args, { windowsHide: true });

    let stderr = '';
    let stdout = '';
    child.stdout?.on('data', (b) => {
      stdout += b.toString();
    });
    child.stderr?.on('data', (b) => {
      stderr += b.toString();
    });

    const timeout = setTimeout(() => {
      child.kill('SIGKILL');
      reject(new Error(`LibreOffice conversion timed out after ${env.libreOfficeTimeoutMs}ms`));
    }, env.libreOfficeTimeoutMs);

    child.on('error', (err) => {
      clearTimeout(timeout);
      reject(new Error(`Failed to spawn LibreOffice (${env.libreOfficePath}): ${err.message}`));
    });

    child.on('close', (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`LibreOffice exited with code ${code}. stderr=${stderr.trim()} stdout=${stdout.trim()}`));
    });
  });
}
