import { DataTypes } from "sequelize";

export async function up({ context: queryInterface }) {
  await queryInterface.addColumn("blogs", "year", {
    type: DataTypes.INTEGER,
    allowNull: true,
  });

  // 添加 CHECK 约束
  await queryInterface.sequelize.query(`
    ALTER TABLE blogs
    ADD CONSTRAINT year_check
    CHECK (year >= 1991 AND year <= EXTRACT(YEAR FROM CURRENT_DATE));
  `);
}

export async function down({ context: queryInterface }) {
  // 删除 CHECK 约束
  await queryInterface.sequelize.query(`
    ALTER TABLE blogs DROP CONSTRAINT IF EXISTS year_check;
  `);
  await queryInterface.removeColumn("blogs", "year");
}
