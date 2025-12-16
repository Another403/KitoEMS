using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddLeaveType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "EmployeeId",
                table: "Receipts",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "CustomerPhone",
                table: "Receipts",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LeaveType",
                table: "Leaves",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddUniqueConstraint(
                name: "AK_Customers_PhoneNumber",
                table: "Customers",
                column: "PhoneNumber");

            migrationBuilder.CreateIndex(
                name: "IX_Receipts_CustomerPhone",
                table: "Receipts",
                column: "CustomerPhone");

            migrationBuilder.CreateIndex(
                name: "IX_Receipts_EmployeeId",
                table: "Receipts",
                column: "EmployeeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Receipts_AspNetUsers_EmployeeId",
                table: "Receipts",
                column: "EmployeeId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Receipts_Customers_CustomerPhone",
                table: "Receipts",
                column: "CustomerPhone",
                principalTable: "Customers",
                principalColumn: "PhoneNumber");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Receipts_AspNetUsers_EmployeeId",
                table: "Receipts");

            migrationBuilder.DropForeignKey(
                name: "FK_Receipts_Customers_CustomerPhone",
                table: "Receipts");

            migrationBuilder.DropIndex(
                name: "IX_Receipts_CustomerPhone",
                table: "Receipts");

            migrationBuilder.DropIndex(
                name: "IX_Receipts_EmployeeId",
                table: "Receipts");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_Customers_PhoneNumber",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "LeaveType",
                table: "Leaves");

            migrationBuilder.AlterColumn<string>(
                name: "EmployeeId",
                table: "Receipts",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "CustomerPhone",
                table: "Receipts",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);
        }
    }
}
