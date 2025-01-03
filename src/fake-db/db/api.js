
import Mock from "fake-db/mock";


  const customerData = [
    { "id": 1, "Customer_Number": "180764", "Customer_Name": "Fiesta Pasco/Hispanic Foods" },
    { "id": 2, "Customer_Number": "180765", "Customer_Name": "Fiesta Sunnyside/Hispanic Mkts" },
    { "id": 3, "Customer_Number": "180766", "Customer_Name": "C.O.D. Meats" },
    { "id": 4, "Customer_Number": "180767", "Customer_Name": "Fiesta Yakima/Hispanic Venture" },
    { "id": 5, "Customer_Number": "242171", "Customer_Name": "Hong Phat Market" },
    { "id": 6, "Customer_Number": "242176", "Customer_Name": "Hoquiam Food & Clothing Bank" },
    { "id": 7, "Customer_Number": "242180", "Customer_Name": "Hood Canal Grocery" },
    { "id": 8, "Customer_Number": "242190", "Customer_Name": "Hopelink" },
    { "id": 9, "Customer_Number": "241641", "Customer_Name": "Haynes, Grover" },
    { "id": 10, "Customer_Number": "242273", "Customer_Name": "HUI Trading Inc." },
    { "id": 11, "Customer_Number": "242296", "Customer_Name": "Huarachitos Cocina Mexicana" },
    { "id": 12, "Customer_Number": "242303", "Customer_Name": "Ht Oak Tree Market, Inc." },
    { "id": 13, "Customer_Number": "242340", "Customer_Name": "Hung San Foods Inc." },
    { "id": 14, "Customer_Number": "242357", "Customer_Name": "Huntley, Zjerry" },
    { "id": 15, "Customer_Number": "242359", "Customer_Name": "Husky Deli & Ice Cream Inc." },
    { "id": 16, "Customer_Number": "242405", "Customer_Name": "Huxtables Kitchen Inc" },
    { "id": 17, "Customer_Number": "34919", "Customer_Name": "Asian Food Center LLC" },
    { "id": 18, "Customer_Number": "349191", "Customer_Name": "Asian Family Market Bellevue, LLC" },
    { "id": 19, "Customer_Number": "349193", "Customer_Name": "Asian Food Center Beaverton, LLC" },
    { "id": 20, "Customer_Number": "349194", "Customer_Name": "Asian Food Center Seattle, LLC" },
    { "id": 21, "Customer_Number": "34947", "Customer_Name": "East Asia Market" },
    { "id": 22, "Customer_Number": "34958", "Customer_Name": "Asian Planet Food" },
    { "id": 23, "Customer_Number": "384284", "Customer_Name": "Los Tapatios Market" },
    { "id": 24, "Customer_Number": "390018", "Customer_Name": "K2 Sports" },
    { "id": 25, "Customer_Number": "390025", "Customer_Name": "Valerio, Jimenez" },
    { "id": 26, "Customer_Number": "390481", "Customer_Name": "Kuzma Fish Market" },
    { "id": 27, "Customer_Number": "401020", "Customer_Name": "Los Toreros Pasco" },
    { "id": 28, "Customer_Number": "401025", "Customer_Name": "Los Tres Pueblos Market Place" },
    { "id": 29, "Customer_Number": "401030", "Customer_Name": "Los Vecinos Meat Market" },
    { "id": 30, "Customer_Number": "401050", "Customer_Name": "Yoly, LLC dba Los Vecinos" },
    { "id": 31, "Customer_Number": "401400", "Customer_Name": "Yoke's Foods Inc" },
    { "id": 32, "Customer_Number": "401628", "Customer_Name": "Market House Meats" },
    { "id": 33, "Customer_Number": "410025", "Customer_Name": "Lummi Food Bank" },
    { "id": 34, "Customer_Number": "410026", "Customer_Name": "Lumper Services" },
    { "id": 35, "Customer_Number": "410027", "Customer_Name": "Pallet Sales" },
    { "id": 36, "Customer_Number": "410040", "Customer_Name": "Lynnwood Food Bank" },
    { "id": 37, "Customer_Number": "410101", "Customer_Name": "MacDonald Meats" },
    { "id": 38, "Customer_Number": "410110", "Customer_Name": "McDonald Wholesale" },
    { "id": 39, "Customer_Number": "410118", "Customer_Name": "Mchenry, Amy/Ryan" },
    { "id": 40, "Customer_Number": "410123", "Customer_Name": "McIntire, Dalene" },
    { "id": 41, "Customer_Number": "410124", "Customer_Name": "McManus, Michael" },
    { "id": 42, "Customer_Number": "410125", "Customer_Name": "McKays Market" },
    { "id": 43, "Customer_Number": "410190", "Customer_Name": "Mama Zoila's, Inc." },
    { "id": 44, "Customer_Number": "410195", "Customer_Name": "Manciu, Claudia" },
    { "id": 45, "Customer_Number": "410201", "Customer_Name": "Mannas, Lori" },
    { "id": 46, "Customer_Number": "470043", "Customer_Name": "On Safari Foods" },
    { "id": 47, "Customer_Number": "470145", "Customer_Name": "Orcas Food Cooperative" },
    { "id": 48, "Customer_Number": "470150", "Customer_Name": "Orcas Island Market" },
    { "id": 49, "Customer_Number": "470204", "Customer_Name": "Ocean Foods Ltd." },
    { "id": 50, "Customer_Number": "470220", "Customer_Name": "Buffets, Inc." },
    { "id": 51, "Customer_Number": "470221", "Customer_Name": "Hong Chang" },
    { "id": 52, "Customer_Number": "470250", "Customer_Name": "Odyssey Enterprises, Inc." },
    { "id": 53, "Customer_Number": "470325", "Customer_Name": "Olive Aura" },
    { "id": 54, "Customer_Number": "470384", "Customer_Name": "Olympic Meats Sequim" },
    { "id": 55, "Customer_Number": "470389", "Customer_Name": "Oriental Food Distributors" },
    { "id": 56, "Customer_Number": "470458", "Customer_Name": "American Fast Freight" },
    { "id": 57, "Customer_Number": "470653", "Customer_Name": "Oriental Food Value Wholesale" },
    { "id": 58, "Customer_Number": "470654", "Customer_Name": "Oriental Meats" },
    { "id": 59, "Customer_Number": "470661", "Customer_Name": "Ortega's Meat Distributing, Inc." },
    { "id": 60, "Customer_Number": "470662", "Customer_Name": "Elma Farm Stand & Public Market" },
    { "id": 61, "Customer_Number": "470663", "Customer_Name": "El Pollo Real" },
    { "id": 62, "Customer_Number": "470664", "Customer_Name": "El Porton de Pepe" },
    { "id": 63, "Customer_Number": "470665", "Customer_Name": "El Porton Yakima" },
    { "id": 64, "Customer_Number": "470666", "Customer_Name": "El Porton Union Gap" },
    { "id": 65, "Customer_Number": "470667", "Customer_Name": "El Porton Richland" },
    { "id": 66, "Customer_Number": "470668", "Customer_Name": "El Portal Omak" },
    { "id": 67, "Customer_Number": "470670", "Customer_Name": "El Porton Zillah" },
    { "id": 68, "Customer_Number": "470675", "Customer_Name": "El Porton - Wenatchee" },
    { "id": 69, "Customer_Number": "470825", "Customer_Name": "Oversea Casing Company" },
    { "id": 70, "Customer_Number": "470853", "Customer_Name": "Owen's Meats" },
    { "id": 71, "Customer_Number": "500033", "Customer_Name": "Pacific Food Distributors" },
    { "id": 72, "Customer_Number": "502600", "Customer_Name": "Puget Sound's Best Chicken" },
    { "id": 73, "Customer_Number": "502610", "Customer_Name": "Purr-Ferred Pet Food, Inc." },
    { "id": 74, "Customer_Number": "502621", "Customer_Name": "Puyallup Food Bank" },
    { "id": 75, "Customer_Number": "502623", "Customer_Name": "Qualicious LLC" },
    { "id": 76, "Customer_Number": "502625", "Customer_Name": "Quality Distributors - Guam" },
    { "id": 77, "Customer_Number": "502905", "Customer_Name": "Puget Sound Energy" },
    { "id": 78, "Customer_Number": "502955", "Customer_Name": "Popeye's Chicken - Vancouver Hwy 99" },
    { "id": 79, "Customer_Number": "502956", "Customer_Name": "Sunny Day Partners" },
    { "id": 80, "Customer_Number": "502960", "Customer_Name": "Popeye's Clackamas" },
    { "id": 81, "Customer_Number": "503108", "Customer_Name": "La Tapatia #2" },
    { "id": 82, "Customer_Number": "503125", "Customer_Name": "La Tipica Oaxaquena" },
    { "id": 83, "Customer_Number": "504475", "Customer_Name": "Parrish, Blake" },
    { "id": 84, "Customer_Number": "593555", "Customer_Name": "Sodo Pet Food Company LLC" },
    { "id": 85, "Customer_Number": "593557", "Customer_Name": "Sogda Limited" },
    { "id": 86, "Customer_Number": "593560", "Customer_Name": "Solid Ground WA" },
    { "id": 87, "Customer_Number": "621263", "Customer_Name": "Beyers Market" },
    { "id": 88, "Customer_Number": "621405", "Customer_Name": "Natural Pantry" },
    { "id": 89, "Customer_Number": "621500", "Customer_Name": "Them Shoppe, LLC" },
    { "id": 90, "Customer_Number": "621503", "Customer_Name": "The Meat Shop" },
    { "id": 91, "Customer_Number": "621504", "Customer_Name": "Ford, Lance And Lisa" },
    { "id": 92, "Customer_Number": "621505", "Customer_Name": "The Markets LLC" }
  ]
  



  const priceBooktemplate =[
    { "id": 1, "pricebook": "Acme Poultry PriceBook", "info": "View Price Book" },
    { "id": 2, "pricebook": "Alaska Sea Pack PriceBook", "info": "View Price Book" },
    { "id": 3, "pricebook": "Asian Pacific Market PriceBook", "info": "View Price Book" },
    { "id": 4, "pricebook": "Azteca PriceBook", "info": "View Price Book" },
    { "id": 5, "pricebook": "Aloha Produce PriceBook", "info": "View Price Book" },
    { "id": 6, "pricebook": "B&D Foods PriceBook", "info": "View Price Book" },
    { "id": 7, "pricebook": "Coro Foods PriceBook", "info": "View Price Book" },
    { "id": 8, "pricebook": "Green Valley Farms PriceBook", "info": "View Price Book" },
    { "id": 9, "pricebook": "Blue Wave Seafoods PriceBook", "info": "View Price Book" },
    { "id": 10, "pricebook": "Sunrise Distributors PriceBook", "info": "View Price Book" }
  ]
  


  Mock.onGet("/api/pricebook/get-customer-list").reply(() => {
    const response = customerData;
    return [200, response];
  });


  Mock.onGet("/api/pricebook/get-pricebook-template").reply(() => {
    const response = priceBooktemplate;
    return [200, response];
  });
  