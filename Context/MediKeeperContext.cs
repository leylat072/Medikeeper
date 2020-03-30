using Microsoft.EntityFrameworkCore;
using Server.Model;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Context
{
    public class MediKeeperContext : Microsoft.EntityFrameworkCore.DbContext

    {

        public MediKeeperContext(DbContextOptions<MediKeeperContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Item>().ToTable("Items");
           
        }
        
        public Microsoft.EntityFrameworkCore.DbSet<Item> Items { get; set; }
      
    }

    public static class DbInitializer
    {
        public static void Initialize(MediKeeperContext context)
        {
            context.Database.EnsureCreated();

            // Look for any items.
            if (context.Items.Any())
            {
                return;   // DB has been seeded
            }

            IList<Item> items = new List<Item>();

            var m = @".\data\items.txt";

            // Read the file and display it line by line.
            System.IO.StreamReader file =
                new System.IO.StreamReader(m);

             string line;
            int l = 0;
            while ((line = file.ReadLine()) != null)
            {
                if (l > 1)
                {
                    string[] words = line.Split(',');
                    items.Add(new Item()
                    {
                      //  Id = Convert.ToInt32(words[0]),
                        Name = words[1],
                        Cost = Convert.ToInt32(words[2])
                    });
                }
                l++;
            }
            file.Close();
            context.Items.AddRange(items);
            context.SaveChanges();
        }
    }
}
    //public class ItemInitializer : DropCreateDatabaseAlways<MediKeeperContext>
    //{
    //    protected override void Seed(MediKeeperContext context)
    //    {
    //        IList<Item> items = new List<Item>();

    //        // Read the file and display it line by line.
    //        System.IO.StreamReader file =
    //            new System.IO.StreamReader(@"c:\yourFile.txt");
    //        string line;
    //        int l = 0;
    //        while ((line = file.ReadLine()) != null)
    //        {
    //            if (l > 1)
    //            {
    //                string[] words = line.Split(',');
    //                items.Add(new Item()
    //                {
    //                    Id = Convert.ToInt32(words[0]),
    //                    Name = words[1],
    //                    Cost = Convert.ToInt32(words[2])
    //                });
    //            }
    //        }
    //        file.Close();
    //        context.Items.AddRange(items);

    //        base.Seed(context);
    //    }
    //}
//}


//public MediKeeperContext(DbContextOptions<MediKeeperContext> opt) : base(opt)
//{
//    Database.SetInitializer(new ItemInitializer());
//}
//public MediKeeperContext() : base("")
//{
//    Database.SetCommandTimeout(60);
//}