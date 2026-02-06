import { isEmpty } from "../../../Utils";
import { logger } from "../../../Utils/Logger";
import { CELLPROTECT, CRDTDataType } from "../../../Interface/WebSocket";
import { CellProtectionService } from "../../../Service/CellProtection";

/**
 * Cell Protection Data Service
 */
export function cp(data: string) {
    logger.info("[CRDT DATA]:", data);
    const { t, v, i, op } = <CRDTDataType<CELLPROTECT>>JSON.parse(data);
    if (t !== "cp") return logger.error("t is not cp.");
    if (isEmpty(i)) return logger.error("i is undefined.");

    //  [CRDT DATA]: {"t":"cp","i":"85040950-bd62-4102-88ed-bd91165571b6","v":{"range":"C7:E10"},"op":"add"}
    //  [CRDT DATA]: {"t":"cp","i":"85040950-bd62-4102-88ed-bd91165571b6","v":{"range":"C7:E10"},"op":"delete"}

    // 每次操作都会映射为一个数据项，针对数据项做 CRUD 即可。
    // WARN ：前台不会出现重复的数据项，所以不需要做数据去重，也不需要考虑判定存在。
    if (op === "add") {
        CellProtectionService.createCellProtection({
            worker_sheet_id: i,
            range: v.range,
        });
    } else if (op === "del") {
        CellProtectionService.deleteCellProtection(i, v.range);
    }
}
