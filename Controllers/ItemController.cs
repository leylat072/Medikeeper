using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Server.Model;
using Server.Context;
namespace Server.Controllers
{
    [ApiController]
    [Route("[controller]")]

    [EnableCors("AllowOrigin")]
    public class ItemController : ControllerBase
    {
        

        private readonly ILogger<ItemController> _logger;
        readonly MediKeeperContext _context;

        public ItemController(ILogger<ItemController> logger, MediKeeperContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet()]
        public string Home()
        {
            return "Hi";
        }


        [HttpGet("items")]
        public IEnumerable<Item> GetALL()
        {
            var items = _context.Items.ToList().OrderBy(i => i.Name);
            return items;
        }

        [HttpGet("itembyid/{id}")]
        public Item GetItemById(int id)
        {
            var item = _context.Items.Where(i => i.Id == id).FirstOrDefault();
            return item;
        }

        [HttpGet("itembyname/{name}")]
        public Item GetItemByName(string name)
        {
            var item = _context.Items.Where(i => i.Name.ToLower() == name.ToLower()).FirstOrDefault();
            return item;
        }

        [HttpDelete("delete/{id}")]
        public void Delete(int id )
        {
            Item item = _context.Items.Where(i => i.Id == id).FirstOrDefault();
            _context.Items.Remove(item);
            _context.SaveChanges();
        }

        [HttpPut("edit")]
        public void Edit([FromBody] Item item)
        {
            Item _item = _context.Items.Where(i => i.Id == item.Id).FirstOrDefault();
            _item.Cost = item.Cost;
            _item.Name = item.Name;
            _context.SaveChanges();
        }
        [HttpPost("add")]
        public void Add([FromBody] Item item)
        {
            Item _item = new Item()
            {
              Cost = item.Cost,
              Name = item.Name
            };
            _context.Items.Add(_item);
            _context.SaveChanges();
        }

        [HttpGet("maxitems")]
        public IEnumerable<Item> GetMaxItems()
        {
            var items = _context.Items.GroupBy(i => i.Name, (i, j) => new Item
            {
                Id = 1,
                Cost = j.Max(z => z.Cost),
                Name = i
            }).OrderBy(i => i.Name).ToList();
            return items;
        }


        [HttpGet("maxitems/{name}")]
        public Item GetMaxItem(string name)
        {
            var cost = _context.Items.Where(i => i.Name.ToLower() == name.ToLower())
                .Max(p => p.Cost);
            return new Item()
            {
                Id = 0,
                Name = name,
                Cost = cost
            };           
        }
    }
}
