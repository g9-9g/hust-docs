export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container py-8 text-sm text-muted-foreground">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <p>© {new Date().getFullYear()} HUST Docs — Kho tài liệu sinh viên Bách khoa Hà Nội.</p>
          <p className="text-xs">Dự án sinh viên, phi lợi nhuận. Vui lòng tôn trọng bản quyền tài liệu.</p>
        </div>
      </div>
    </footer>
  );
}
