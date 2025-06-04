import { UserController } from "./User";
import { initPages } from "./Page/index";
import { FolderController } from "./Folder";
import { FileMapController } from "./FileMap";
import { WorkerBookController } from "./WorkerBooks";
import { uploadImage } from "./Luckysheet/uploadImage";
import { loadSheetData } from "./Luckysheet/LoadSheetData";

// 统一导出控制层对象
export { initPages, uploadImage, loadSheetData, UserController, FolderController, FileMapController, WorkerBookController };
