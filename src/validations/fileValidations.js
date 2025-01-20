import fs from "fs";
import path from "path";

export const deleteFile = (filePath) => {
  const fullPath = path.resolve("public", filePath);
  fs.access(fullPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.log("File tidak ditemukan: ", fullPath);
      return;
    }
    fs.unlink(fullPath, (unlinkErr) => {
      if (unlinkErr) {
        console.log("Gagal menghapus file: ", unlinkErr);
      } else {
        console.log("File berhasil dihapus:", fullPath);
      }
    });
  });
};
