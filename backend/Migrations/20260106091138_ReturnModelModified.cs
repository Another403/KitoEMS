using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class ReturnModelModified : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "OrderId",
                table: "Returns",
                newName: "ReceiptId");

            migrationBuilder.CreateIndex(
                name: "IX_Returns_ReceiptId",
                table: "Returns",
                column: "ReceiptId");

            migrationBuilder.CreateIndex(
                name: "IX_ReturnDetails_BookId",
                table: "ReturnDetails",
                column: "BookId");

            migrationBuilder.CreateIndex(
                name: "IX_ReturnDetails_ReturnId",
                table: "ReturnDetails",
                column: "ReturnId");

            migrationBuilder.AddForeignKey(
                name: "FK_ReturnDetails_Books_BookId",
                table: "ReturnDetails",
                column: "BookId",
                principalTable: "Books",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ReturnDetails_Returns_ReturnId",
                table: "ReturnDetails",
                column: "ReturnId",
                principalTable: "Returns",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Returns_Receipts_ReceiptId",
                table: "Returns",
                column: "ReceiptId",
                principalTable: "Receipts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ReturnDetails_Books_BookId",
                table: "ReturnDetails");

            migrationBuilder.DropForeignKey(
                name: "FK_ReturnDetails_Returns_ReturnId",
                table: "ReturnDetails");

            migrationBuilder.DropForeignKey(
                name: "FK_Returns_Receipts_ReceiptId",
                table: "Returns");

            migrationBuilder.DropIndex(
                name: "IX_Returns_ReceiptId",
                table: "Returns");

            migrationBuilder.DropIndex(
                name: "IX_ReturnDetails_BookId",
                table: "ReturnDetails");

            migrationBuilder.DropIndex(
                name: "IX_ReturnDetails_ReturnId",
                table: "ReturnDetails");

            migrationBuilder.RenameColumn(
                name: "ReceiptId",
                table: "Returns",
                newName: "OrderId");
        }
    }
}
