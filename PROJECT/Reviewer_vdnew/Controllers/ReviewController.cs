using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace VidWorld.Admin.Controllers
{
    public class ReviewController : Controller
    {
        // GET: Review
        public ActionResult Review_Login()
        {
            return View();
        }
        public ActionResult Review_Post()
        {
            return View();
        }
        public ActionResult Review_Affliate()
        {
            return View();
        }
        //public ActionResult ForgetPassword()
        //{
        //    return View();
        //}
        public ActionResult Forget_Password()
        {
            return View();
        }
    }
}