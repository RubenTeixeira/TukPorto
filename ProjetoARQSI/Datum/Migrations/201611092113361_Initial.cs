namespace Datum.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Local",
                c => new
                    {
                        LocalID = c.Int(nullable: false, identity: true),
                        GPS_Lat = c.Decimal(nullable: false, precision: 18, scale: 2),
                        GPS_Long = c.Decimal(nullable: false, precision: 18, scale: 2),
                        Nome = c.String(),
                    })
                .PrimaryKey(t => t.LocalID);
            
            CreateTable(
                "dbo.Metereologia",
                c => new
                    {
                        MetereologiaID = c.Int(nullable: false, identity: true),
                        LocalID = c.Int(nullable: false),
                        DataHoraLeitura = c.DateTime(nullable: false),
                        Temp = c.Double(nullable: false),
                        Vento = c.Double(nullable: false),
                        Humidade = c.Int(nullable: false),
                        Pressao = c.Int(nullable: false),
                        NO = c.Double(nullable: false),
                        NO2 = c.Double(nullable: false),
                        CO2 = c.Double(nullable: false),
                    })
                .PrimaryKey(t => t.MetereologiaID)
                .ForeignKey("dbo.Local", t => t.LocalID, cascadeDelete: true)
                .Index(t => t.LocalID);
            
            CreateTable(
                "dbo.PointOfInterest",
                c => new
                    {
                        PointOfInterestID = c.Int(nullable: false, identity: true),
                        Nome = c.String(),
                        Descricao = c.String(),
                        LocalID = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.PointOfInterestID)
                .ForeignKey("dbo.Local", t => t.LocalID, cascadeDelete: true)
                .Index(t => t.LocalID);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.PointOfInterest", "LocalID", "dbo.Local");
            DropForeignKey("dbo.Metereologia", "LocalID", "dbo.Local");
            DropIndex("dbo.PointOfInterest", new[] { "LocalID" });
            DropIndex("dbo.Metereologia", new[] { "LocalID" });
            DropTable("dbo.PointOfInterest");
            DropTable("dbo.Metereologia");
            DropTable("dbo.Local");
        }
    }
}
