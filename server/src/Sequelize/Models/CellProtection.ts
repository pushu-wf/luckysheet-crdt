/**
 * 单元格保护功能
 */

import { Model, Sequelize, DataTypes, InferAttributes } from "sequelize";
import { WorkerSheetModel } from "./WorkerSheet";

export class CellProtectionModel extends Model {
    declare cp_id?: string;
    declare worker_sheet_id?: string;
    declare range: string;
    // 后续需要添加对应的单元格人员权限，可以拓展相应的属性实现

    static registerModule(sequelize: Sequelize) {
        CellProtectionModel.init(
            {
                cp_id: {
                    type: DataTypes.STRING,
                    primaryKey: true,
                    allowNull: false,
                    comment: "表ID",
                    defaultValue: DataTypes.UUIDV4, // 默认使用 uuid 作为 主键ID
                },
                worker_sheet_id: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: "所属工作表ID",
                    references: {
                        model: WorkerSheetModel,
                        key: "worker_sheet_id",
                    },
                },
                range: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: "保护单元格范围",
                    defaultValue: "",
                },
            },
            {
                sequelize,
                tableName: "cellprotections",
            },
        );
    }
}

// 导出类型
export type CellProtectionModelType = InferAttributes<CellProtectionModel>;
