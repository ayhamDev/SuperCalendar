const root = document.querySelector("#calendar-root");
const parseHtml = (string) => {
  return new DOMParser().parseFromString(string, "text/html").body.firstChild;
};
const mobileRE =
  /(android|bb\d+|meego).+mobile|armv7l|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series[46]0|samsungbrowser|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i;
const notMobileRE = /CrOS/;

const tabletRE = /android|ipad|playbook|silk/i;

function isMobile(opts) {
  if (!opts) opts = {};
  let ua = opts.ua;
  if (!ua && typeof navigator !== "undefined") ua = navigator.userAgent;
  if (ua && ua.headers && typeof ua.headers["user-agent"] === "string") {
    ua = ua.headers["user-agent"];
  }
  if (typeof ua !== "string") return false;

  let result =
    (mobileRE.test(ua) && !notMobileRE.test(ua)) ||
    (!!opts.tablet && tabletRE.test(ua));

  if (
    !result &&
    opts.tablet &&
    opts.featureDetect &&
    navigator &&
    navigator.maxTouchPoints > 1 &&
    ua.indexOf("Macintosh") !== -1 &&
    ua.indexOf("Safari") !== -1
  ) {
    result = true;
  }

  return result;
}
const parseCSS = (string) => {
  return new DOMParser()
    .parseFromString(string, "text/html")
    .head.querySelector("style");
};

const convertTime12to24 = (time12h) => {
  const [time, modifier] = time12h.split(" ");

  let [hours, minutes] = time.split(":");

  if (hours === "12") {
    hours = "00";
  }

  if (modifier === "PM") {
    hours = parseInt(hours, 10) + 12;
  }

  return `${hours}:${minutes}`;
};

const convertTime24to12 = (time12h) => {
  const [time, modifier] = time12h.split(" ");

  let [hours, minutes] = time.split(":");

  // if (hours === "12") {
  //   hours = "00";
  // }
  if (parseInt(hours) > 12) {
    hours = parseInt(hours, 10) - 12;
  }

  return `${hours}:${minutes}`;
};
const temp = parseHtml(/*html*/ `
      <div >
        <div class="sticky top-0" style="z-index: 9;">
          <section class="flex justify-between items-center p-4 select-none bg-gray-50 border-b-2 border-gray-100 gap-6 flex-wrap">
              <div class="flex justify-between items-center">
                  <h1 class="text-2xl font-normal title">Class A</h1>
                  <pre class="text-xl"> / </pre>  
                  
                  <h1 class="cursor-pointer date_picker text-2xl font-semibold selected_date">January 2022</h1>  
                  <input style="display:none;" type="date" class="date_picker_input" name="" id="">
  
  
              </div>
              <div class="flex justify-between items-center ${
                isMobile() ? "gap-2" : "gap-4"
              } flex-wrap no_print">
                <div class="cursor-default rounded-md border border-gray-200 bg-white text-center shadow-sm focus:border-indigo-500 focus:outline-none font-medium text-sm focus:ring-1 focus:ring-indigo-500 flex justify-between items-center">
                  <span class="material-icons cursor-pointer text-gray-400 hover:text-gray-800 transition-all duration-200 back px-4 py-3 pr-1">arrow_back_ios</span>
                  <div class="mx-3 cursor-pointer text-gray-700 hover:text-black transition-all duration-150 reset">Today</div>
                  <span class="material-icons cursor-pointer text-gray-400 hover:text-gray-800 transition-all duration-200 next px-4 py-3 pl-1">arrow_forward_ios</span>
                </div>
                <div>
                  <div class="relative ${
                    isMobile() ? "hidden" : " inline-block"
                  } text-left">
                    <div>

                      <button type="button" class="drop_down_btn inline-flex w-full justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100" id="menu-button" aria-expanded="true" aria-haspopup="true">
                        <span>Day View</span>
                        <!-- Heroicon name: mini/chevron-down -->
                        <svg class="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  
                    <!--
                      Dropdown menu, show/hide based on menu state.
                  
                      Entering: "transition ease-out duration-100"
                        From: "transform opacity-0 scale-95"
                        To: "transform opacity-100 scale-100"
                      Leaving: "transition ease-in duration-75"
                        From: "transform opacity-100 scale-100"
                        To: "transform opacity-0 scale-95"
                    -->
                    <div class="drop_down_menu hidden transition-all duration-300 absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                      <div class="py-1" role="none">
                        <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" -->
                        <div data-id="1" class="drop_down_menu-item text-gray-700 block px-4 py-2 text-sm hover:text-gray-900 hover:bg-gray-100 transition-all duration-200">
                            Day View
                        </div>
                        <div data-id="0" class="drop_down_menu-item text-gray-700 block px-4 py-2 text-sm hover:text-gray-900 hover:bg-gray-100 transition-all duration-200">
                          Week View
                      </div>

  
                      </div>
                    </div>
                  </div>
  
                </div>
                <button class="print_btn transition-all shadow duration-150 active:scale-90 inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-2 text-base font-medium text-indigo-600 hover:bg-indigo-50 gap-2"> 
                  <span class="material-icons">print</span><span>Print</span>
                </button>
                <button class="newEvent_btn transition-all duration-150 active:scale-90 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-2 text-base font-medium text-white hover:bg-indigo-700 cursor-pointer"> 
                  Add Event
                </button>

              </div>
          </section>
            <section class="date_container overflow-y flex bg-white shadow-sm border-b-2 border-gray-200">
              <div style="${isMobile() ? "margin-left:58px;" : ""}" class="${
  isMobile() ? "" : "ml-16"
}"></div>

            </section>
  
          
      </div>
        <section class="h-full flex z-0 main-content">
          <aside class="flex flex-col" style="width: 4.3rem !important;">
            <span style="height: 50px;" class="text-center flex flex-col justify-start items-center text-sm text-gray-400 p-2">12 AM</span>
            <span style="height: 100px;" class="text-center flex flex-col justify-center items-center text-sm text-gray-400">1 AM</span>
            <span style="height: 100px;" class="text-center flex flex-col justify-center items-center text-sm text-gray-400">2 AM</span>
            <span style="height: 100px;" class="text-center flex flex-col justify-center items-center text-sm text-gray-400">3 AM</span>
            <span style="height: 100px;" class="text-center flex flex-col justify-center items-center text-sm text-gray-400">4 AM</span>
            <span style="height: 100px;" class="text-center flex flex-col justify-center items-center text-sm text-gray-400">5 AM</span>
            <span style="height: 100px;" class="text-center flex flex-col justify-center items-center text-sm text-gray-400">6 AM</span>
            <span style="height: 100px;" class="text-center flex flex-col justify-center items-center text-sm text-gray-400">7 AM</span>
            <span style="height: 100px;" class="text-center flex flex-col justify-center items-center text-sm text-gray-400">8 AM</span>
            <span style="height: 100px;" class="text-center flex flex-col justify-center items-center text-sm text-gray-400">9 AM</span>
            <span style="height: 100px;" class="text-center flex flex-col justify-center items-center text-sm text-gray-400">10 AM</span>
            <span style="height: 100px;" class="text-center flex flex-col justify-center items-center text-sm text-gray-400">11 AM</span>
            <span style="height: 100px;" class="text-center flex flex-col justify-center items-center text-sm text-gray-400">12 PM</span>
            <span style="height: 100px;" class="text-center flex flex-col justify-center items-center text-sm text-gray-400">1 PM</span>
            <span style="height: 100px;" class="text-center flex flex-col justify-center items-center text-sm text-gray-400">2 PM</span>
            <span style="height: 100px;" class="text-center flex flex-col justify-center items-center text-sm text-gray-400">3 PM</span>
            <span style="height: 100px;" class="text-center flex flex-col justify-center items-center text-sm text-gray-400">4 PM</span>
            <span style="height: 100px;" class="text-center flex flex-col justify-center items-center text-sm text-gray-400">5 PM</span>
            <span style="height: 100px;" class="text-center flex flex-col justify-center items-center text-sm text-gray-400">6 PM</span>
            <span style="height: 100px;" class="text-center flex flex-col justify-center items-center text-sm text-gray-400">7 PM</span>
            <span style="height: 100px;" class="text-center flex flex-col justify-center items-center text-sm text-gray-400">8 PM</span>
            <span style="height: 100px;" class="text-center flex flex-col justify-center items-center text-sm text-gray-400">9 PM</span>
            <span style="height: 100px;" class="text-center flex flex-col justify-center items-center text-sm text-gray-400">10 PM</span>
            <span style="height: 100px; margin-bottom:50px;" class="text-center flex flex-col justify-center items-center text-sm text-gray-400">11 PM</span>
          </aside>
          <section class="grid grid-cols-7 w-full relative gap-6 pt-0 p-4">
            <div class="absolute top-0 left-0 w-full h-full mt-0">
              <div class="w-full bg-gray-100" style="height: 1px; position: absolute; top: 50px; z-index: -1;"></div>
              <div class="w-full bg-gray-200" style="height: 1px; position: absolute; top: 100px; z-index: -1;"></div>
              <div class="w-full bg-gray-100" style="height: 1px; position: absolute; top: 150px; z-index: -1;"></div>
              <div class="w-full bg-gray-200" style="height: 1px; position: absolute; top: 200px; z-index: -1;"></div>
              <div class="w-full bg-gray-100" style="height: 1px; position: absolute; top: 250px; z-index: -1;"></div>
              <div class="w-full bg-gray-200" style="height: 1px; position: absolute; top: 300px; z-index: -1;"></div>
              <div class="w-full bg-gray-100" style="height: 1px; position: absolute; top: 350px; z-index: -1;"></div>
              <div class="w-full bg-gray-200" style="height: 1px; position: absolute; top: 400px; z-index: -1;"></div>
              <div class="w-full bg-gray-100" style="height: 1px; position: absolute; top: 450px; z-index: -1;"></div>
              <div class="w-full bg-gray-200" style="height: 1px; position: absolute; top: 500px; z-index: -1;"></div>
              <div class="w-full bg-gray-100" style="height: 1px; position: absolute; top: 550px; z-index: -1;"></div>
              <div class="w-full bg-gray-200" style="height: 1px; position: absolute; top: 600px; z-index: -1;"></div>
              <div class="w-full bg-gray-100" style="height: 1px; position: absolute; top: 650px; z-index: -1;"></div>
              <div class="w-full bg-gray-200" style="height: 1px; position: absolute; top: 700px; z-index: -1;"></div>
              <div class="w-full bg-gray-100" style="height: 1px; position: absolute; top: 750px; z-index: -1;"></div>
              <div class="w-full bg-gray-200" style="height: 1px; position: absolute; top: 800px; z-index: -1;"></div>
              <div class="w-full bg-gray-100" style="height: 1px; position: absolute; top: 850px; z-index: -1;"></div>
              <div class="w-full bg-gray-200" style="height: 1px; position: absolute; top: 900px; z-index: -1;"></div>
              <div class="w-full bg-gray-100" style="height: 1px; position: absolute; top: 950px; z-index: -1;"></div>
              <div class="w-full bg-gray-200" style="height: 1px; position: absolute; top: 1000px; z-index: -1;"></div>
              <div class="w-full bg-gray-100" style="height: 1px; position: absolute; top: 1050px; z-index: -1;"></div>
              <div class="w-full bg-gray-200" style="height: 1px; position: absolute; top: 1100px; z-index: -1;"></div>
              <div class="w-full bg-gray-100" style="height: 1px; position: absolute; top: 1150px; z-index: -1;"></div>
              <div class="w-full bg-gray-200" style="height: 1px; position: absolute; top: 1200px; z-index: -1;"></div>
              <div class="w-full bg-gray-100" style="height: 1px; position: absolute; top: 1250px; z-index: -1;"></div>
              <div class="w-full bg-gray-200" style="height: 1px; position: absolute; top: 1300px; z-index: -1;"></div>
              <div class="w-full bg-gray-100" style="height: 1px; position: absolute; top: 1350px; z-index: -1;"></div>
              <div class="w-full bg-gray-200" style="height: 1px; position: absolute; top: 1400px; z-index: -1;"></div>
              <div class="w-full bg-gray-100" style="height: 1px; position: absolute; top: 1450px; z-index: -1;"></div>
              <div class="w-full bg-gray-200" style="height: 1px; position: absolute; top: 1500px; z-index: -1;"></div>
              <div class="w-full bg-gray-100" style="height: 1px; position: absolute; top: 1550px; z-index: -1;"></div>
              <div class="w-full bg-gray-200" style="height: 1px; position: absolute; top: 1600px; z-index: -1;"></div>
              <div class="w-full bg-gray-100" style="height: 1px; position: absolute; top: 1650px; z-index: -1;"></div>
              <div class="w-full bg-gray-200" style="height: 1px; position: absolute; top: 1700px; z-index: -1;"></div>
              <div class="w-full bg-gray-100" style="height: 1px; position: absolute; top: 1750px; z-index: -1;"></div>
              <div class="w-full bg-gray-200" style="height: 1px; position: absolute; top: 1800px; z-index: -1;"></div>
              <div class="w-full bg-gray-100" style="height: 1px; position: absolute; top: 1850px; z-index: -1;"></div>
              <div class="w-full bg-gray-200" style="height: 1px; position: absolute; top: 1900px; z-index: -1;"></div>
              <div class="w-full bg-gray-100" style="height: 1px; position: absolute; top: 1950px; z-index: -1;"></div>
              <div class="w-full bg-gray-200" style="height: 1px; position: absolute; top: 2000px; z-index: -1;"></div>
              <div class="w-full bg-gray-100" style="height: 1px; position: absolute; top: 2050px; z-index: -1;"></div>
              <div class="w-full bg-gray-200" style="height: 1px; position: absolute; top: 2100px; z-index: -1;"></div>
              <div class="w-full bg-gray-100" style="height: 1px; position: absolute; top: 2150px; z-index: -1;"></div>
              <div class="w-full bg-gray-200" style="height: 1px; position: absolute; top: 2200px; z-index: -1;"></div>
              <div class="w-full bg-gray-100" style="height: 1px; position: absolute; top: 2250px; z-index: -1;"></div>
              <div class="w-full bg-gray-200" style="height: 1px; position: absolute; top: 2300px; z-index: -1;"></div>
              <div class="w-full bg-gray-100" style="height: 1px; position: absolute; top: 2350px; z-index: -1;"></div>
              <div class="w-full bg-gray-200" style="height: 1px; position: absolute; top: 2400px; z-index: -1;"></div>
  
              <div class="w-full bg-red-600 animate-pulse no_print time_indicator" style="height: 3px; position: absolute; top: 1000px ; z-index: 1;">
                <div class="w-4 h-4 rounded-full bg-red-600" style="margin-top: -7px;">
                  
                </div>
              </div>
              <div class="w-full h-full flex justify-between weeksOnly">
                <div class="h-full bg-gray-100" style="width: 1px;"></div>
                <div class="h-full bg-gray-100" style="width: 1px;"></div>
                <div class="h-full bg-gray-100" style="width: 1px;"></div>
                <div class="h-full bg-gray-100" style="width: 1px;"></div>
                <div class="h-full bg-gray-100" style="width: 1px;"></div>
                <div class="h-full bg-gray-100" style="width: 1px;"></div>
                <div class="h-full bg-gray-100" style="width: 1px;"></div>
                <div class="h-full bg-gray-100" style="width: 1px;"></div>
              </div>  
            </div>
            <div id="0" class="eventContainer h-full w-full relative firstEventContainer">
  
              </div>
              <div id="1" class="eventContainer h-full w-full relative EventweeksOnly">
              </div>
  
              <div id="2" class="eventContainer h-full w-full relative EventweeksOnly">
  
              </div>
              <div id="3" class="eventContainer h-full w-full relative EventweeksOnly">
              </div>
              <div id="4" class="eventContainer h-full w-full relative EventweeksOnly">
              </div>
              <div id="5" class="eventContainer h-full w-full relative EventweeksOnly">
                
              </div>
              <div id="6" class="eventContainer h-full w-full relative EventweeksOnly">
                
              </div>
              <div id="7" class="eventContainer h-full w-full relative EventweeksOnly">
                
              </div>
          </section>
        </section>
        <div class="h-10"></div>
      </div>

`);
function getWeeksInMonth(year, month) {
  const weeks = [],
    firstDate = new Date(year, month, 1),
    lastDate = new Date(year, month + 1, 0),
    numDays = lastDate.getDate();

  let dayOfWeekCounter = firstDate.getDay();

  for (let date = 1; date <= numDays; date++) {
    if (dayOfWeekCounter === 0 || weeks.length === 0) {
      weeks.push([]);
    }
    weeks[weeks.length - 1].push(date);
    dayOfWeekCounter = (dayOfWeekCounter + 1) % 7;
  }

  return weeks
    .filter((w) => !!w.length)
    .map((w) => ({
      start: w[0],
      end: w[w.length - 1],
      dates: w,
    }));
}

const Months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const Months_short = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
var dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
var dayNames_short = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

class SuperCalendar {
  constructor(config = { view: 0, title: "Title" }, Events = Array()) {
    this.Events = Events;
    this.config = config;
    this.date = { year: null, month: null, day: null };
    this.selectedDate = { year: null, month: null, day: null, week: null };

    this.onEditEvent = function (event_id = String()) {};
    this.onNewEvent = function () {};

    this.date.year = new Date().getFullYear();
    this.date.month = new Date().getMonth();
    this.date.day = new Date().getDate();

    this.selectedDate.year = this.date.year;
    this.selectedDate.month = this.date.month;
    this.selectedDate.day = this.date.day;
    let weeks = getWeeksInMonth(
      this.selectedDate.year,
      this.selectedDate.month
    );
    let found = false;
    if (weeks[0].dates.length < 7) {
      weeks.shift();
    }
    weeks.find((week, index) => {
      if (!found && week.end >= this.selectedDate.day) {
        found = true;
        this.selectedDate.week = index;
      }
    });
    if (isMobile()) {
      this.config.view = 1;
    }
    this.init();
  }
  init() {
    root.innerHTML = ``;
    this.template = temp.cloneNode(true);
    root.append(this.template);

    this.date_input = this.template.querySelector(".date_picker_input");
    this.template.querySelector(".reset").addEventListener("click", () => {
      this.date.year = new Date().getFullYear();
      this.date.month = new Date().getMonth();
      this.date.day = new Date().getDate();

      this.selectedDate.year = new Date().getFullYear();
      this.selectedDate.month = new Date().getMonth();
      this.selectedDate.day = this.date.day;
      let weeks = getWeeksInMonth(
        this.selectedDate.year,
        this.selectedDate.month
      );
      if (weeks[0].dates.length < 7) {
        weeks.shift();
      }

      let found = false;
      weeks.find((week, index) => {
        if (!found && week.end >= this.selectedDate.day) {
          found = true;
          this.selectedDate.week = index;
        }
      });

      this.init();
    });
    this.template.querySelector(".print_btn").addEventListener("click", () => {
      document.body.scrollIntoView();
      window.print();
    });
    const DateFormated = new Date();
    DateFormated.setFullYear(this.selectedDate.year);
    DateFormated.setMonth(this.selectedDate.month);
    DateFormated.setDate(this.selectedDate.day);
    this.date_input.valueAsDate = DateFormated;
    this.date_input.valueAsDate = DateFormated;

    this.template
      .querySelector(".newEvent_btn")
      .addEventListener("click", (e) => {
        this.onNewEvent(e);
      });

    this.template
      .querySelector(".date_picker")
      .addEventListener("click", (e) => {
        this.date_input.showPicker();
      });
    this.date_input.addEventListener("change", () => {
      this.selectedDate.year = this.date_input.valueAsDate.getFullYear();
      this.selectedDate.month = this.date_input.valueAsDate.getMonth();
      this.selectedDate.day = this.date_input.valueAsDate.getDate();

      let weeks = getWeeksInMonth(
        this.selectedDate.year,
        this.selectedDate.month
      );
      let found = false;
      if (weeks[0].dates.length < 7) {
        weeks.shift();
      }
      weeks.find((week, index) => {
        if (!found && week.end >= this.selectedDate.day) {
          found = true;
          this.selectedDate.week = index;
        }
      });
      this.init();
    });
    this.template
      .querySelector(".drop_down_btn")
      .querySelector("span").innerHTML = `${
      this.config.view == 0 ? "Week" : "Day"
    } View`;
    this.template
      .querySelector(".drop_down_btn")
      .addEventListener("click", (e) => {
        e.stopPropagation();
        this.template
          .querySelector(".drop_down_menu")
          .classList.toggle("hidden");
      });
    this.template.addEventListener("click", (e) => {
      e.stopPropagation();
      this.template.querySelector(".drop_down_menu").classList.add("hidden");
    });
    this.template
      .querySelector(".drop_down_menu")
      .querySelectorAll(".drop_down_menu-item")
      .forEach((ele) => {
        ele.addEventListener("click", () => {
          this.config.view = ele.dataset.id;
          // this.date.year = new Date().getFullYear();
          // this.date.month = new Date().getMonth();
          // this.date.day = new Date().getDate();

          // this.selectedDate.year = this.date.year;
          // this.selectedDate.month = this.date.month;
          // this.selectedDate.day = this.date.day;
          // let weeks = getWeeksInMonth(
          //   this.selectedDate.year,
          //   this.selectedDate.month
          // );
          // let found = false;
          // weeks.find((week, index) => {
          //   if (!found && week.end >= this.selectedDate.day) {
          //     found = true;
          //     this.selectedDate.week = index;
          //   }
          // });
          if (this.config.view == 1) {
            let date_box = this.template.querySelector(".date_box");
            if (date_box) {
              let shifted = false;
              let weeks = getWeeksInMonth(
                this.selectedDate.year,
                this.selectedDate.month
              );
              if (weeks[0].dates.length < 7) {
                weeks.shift();
                shifted = true;
              }
              this.selectedDate.year = eval(date_box.dataset.year);
              this.selectedDate.month = eval(date_box.dataset.month);
              this.selectedDate.week = eval(
                shifted
                  ? eval(date_box.dataset.week) + 1
                  : date_box.dataset.week
              );
              this.selectedDate.day = eval(date_box.dataset.day);
              this.config.view = 1;
              this.init();
              // shifted Problem to fix
            }
          } else {
            let date_box = this.template.querySelector(".date_box_alone");
            if (date_box) {
              this.selectedDate.year = eval(date_box.dataset.year);
              this.selectedDate.month = eval(date_box.dataset.month);
              this.selectedDate.week = eval(date_box.dataset.week);
            }
          }

          this.init();
        });
      });
    // time indicator
    var hour = new Date().getHours() * 100;
    var min = new Date().getMinutes() * (100 / 60);
    var time = hour + min;
    this.template.querySelector(".time_indicator").style.top = `${time}px`;

    const views = ["week", "day"];
    const selected = views[this.config.view];
    this.template.querySelector(".title").textContent = this.config.title;
    this.template.querySelector(".selected_date").textContent = `${
      Months[this.selectedDate.month]
    } ${this.selectedDate.year}`;
    if (selected) {
      if (selected == "week") {
        this.genWeeks();
      }
      if (selected == "day") {
        this.getDay();
      }
    }
  }
  genWeeks() {
    this.template.querySelector(".next").addEventListener("click", () => {
      let weeks = getWeeksInMonth(
        this.selectedDate.year,
        this.selectedDate.month
      );

      if (weeks[0].dates.length < 7) {
        weeks.shift();
      }
      if (!weeks[this.selectedDate.week + 1]) {
        this.selectedDate.week = 0;
        if (this.selectedDate.month + 1 > 11) {
          this.selectedDate.month = 0;
          this.selectedDate.year++;
        } else {
          this.selectedDate.month++;
        }
      } else {
        this.selectedDate.week++;
      }

      this.init();
    });

    this.template.querySelector(".back").addEventListener("click", () => {
      let weeks = getWeeksInMonth(
        this.selectedDate.year,
        this.selectedDate.month
      );
      let prev_weeks = getWeeksInMonth(
        this.selectedDate.year,
        this.selectedDate.month - 1
      );

      if (prev_weeks[0].dates.length < 7) {
        prev_weeks.shift();
      }
      if (!weeks[this.selectedDate.week - 1]) {
        this.selectedDate.week = prev_weeks.length - 1;
        if (this.selectedDate.month - 1 < 0) {
          this.selectedDate.month = 11;
          this.selectedDate.year--;
        } else {
          this.selectedDate.month--;
        }
      } else {
        this.selectedDate.week--;
      }

      this.init();
    });
    let day = this.date.day;
    let weeks = getWeeksInMonth(
      this.selectedDate.year,
      this.selectedDate.month
    );

    let shifted = false;
    if (weeks[0].dates.length < 7) {
      weeks.shift();
      shifted = true;
    }
    let valid = true;
    if (weeks[0].start > this.selectedDate.day) {
      let weeks = getWeeksInMonth(
        this.selectedDate.year,
        this.selectedDate.month
      );
      let prev_weeks = getWeeksInMonth(
        this.selectedDate.year,
        this.selectedDate.month - 1
      );

      if (prev_weeks[0].dates.length < 7) {
        prev_weeks.shift();
      }
      if (!weeks[this.selectedDate.week - 1]) {
        this.selectedDate.week = prev_weeks.length - 1;
        if (this.selectedDate.month - 1 < 0) {
          this.selectedDate.month = 11;
          this.selectedDate.year--;
        } else {
          this.selectedDate.month--;
        }
      } else {
        this.selectedDate.week--;
      }
      valid = false;
      this.init();
    }

    valid &&
      weeks[this.selectedDate.week].dates.forEach((date, index) => {
        let date_box = parseHtml(/*html*/ `
      <div data-year="${this.selectedDate.year}" data-month="${
          this.selectedDate.month
        }" data-week="${
          this.selectedDate.week
        }" data-day="${date}" class="date_box hover:bg-green-50 cursor-pointer duration-300 ease-in-out transition-all flex-1 flex gap-1 sm:px-12 px-8 py-4 justify-center items-center border-l-1 border-gray-100 text-center">
          <span class="text-gray-500">${dayNames_short[index]}</span>
          <span class="font-bold p-2 ${
            this.selectedDate.year == this.date.year &&
            this.selectedDate.month == this.date.month &&
            date == this.date.day
              ? "active_day"
              : ""
          }">${date}</span>
      </div>
    `);

        date_box.addEventListener("click", () => {
          this.selectedDate.year = eval(date_box.dataset.year);
          this.selectedDate.month = eval(date_box.dataset.month);
          this.selectedDate.week = eval(
            shifted ? eval(date_box.dataset.week) + 1 : date_box.dataset.week
          );
          this.selectedDate.day = eval(date_box.dataset.day);
          this.config.view = 1;
          this.init();
        });

        this.template.querySelector(".date_container").append(date_box);
        this.template.querySelector(
          `.eventContainer[id="${index}"]`
        ).dataset.day = date;
        this.selectedDate.day = date;
        this.CheckForEvents(
          date,
          this.selectedDate.year,
          this.selectedDate.month,
          index
        );

        if (weeks[weeks.length - 1].end == date) {
          const next_month = getWeeksInMonth(
            this.selectedDate.month + 1 >= 12
              ? this.selectedDate.year + 1
              : this.selectedDate.year,
            this.selectedDate.month + 1 >= 12 ? 0 : this.selectedDate.month + 1
          );
          const next_dates = next_month[0].end < 7 ? next_month[0].dates : [];
          if (this.selectedDate.month < 11 && next_dates.length > 0) {
            this.template.querySelector(".selected_date").textContent = `${
              Months_short[this.selectedDate.month]
            } - ${Months_short[this.selectedDate.month + 1]} ${
              this.selectedDate.year
            }`;
          }
          if (this.selectedDate.month == 11 && next_dates.length > 0) {
            this.template.querySelector(".selected_date").textContent = `${
              Months_short[this.selectedDate.month]
            } ${this.selectedDate.year} - ${Months_short[0]} ${
              this.selectedDate.year + 1
            }`;
          }
          // this.selectedDate.month == 0
          //   ? next_dates.length > 0
          //     ? `${Months_short[this.selectedDate.month]} - ${
          //         Months_short[this.selectedDate.month + 1]
          //       } ${this.selectedDate.year}`
          //     : ``
          //   : next_dates.length > 0
          //   ? `${Months_short[this.selectedDate.month]} ${
          //       this.selectedDate.year
          //     } - ${Months_short[0]} ${this.selectedDate.year + 1}`
          //   : `${Months[this.selectedDate.month]} ${
          //       this.selectedDate.year + 1
          //     }`;

          const blank_dates = next_month[0].dates.length;
          if (next_dates.length > 0) {
            for (let indexNext = 0; indexNext < blank_dates; indexNext++) {
              let date_box = parseHtml(/*html*/ `
                <div data-year="${
                  this.selectedDate.month == 11
                    ? this.selectedDate.year + 1
                    : this.selectedDate.year
                }" data-month="${
                this.selectedDate.month + 1 >= 12
                  ? 0
                  : this.selectedDate.month + 1
              }" data-week="${0}" data-day="${
                next_dates[indexNext]
              }" class="date_box hover:bg-green-50 cursor-pointer duration-300 ease-in-out transition-all flex-1 flex gap-1 sm:px-12 px-8 py-4 justify-center items-center border-l-1 border-gray-100 text-center">
                    <span class="text-gray-500">${
                      dayNames_short[++index]
                    }</span>
                    <span class="font-bold p-2 ${
                      day == next_dates[indexNext] &&
                      (this.selectedDate.month == 11
                        ? this.selectedDate.year + 1
                        : this.selectedDate.year) == this.date.year
                        ? "active_day"
                        : ""
                    }">${next_dates[indexNext]}</span>
                </div>
              `);
              date_box.addEventListener("click", () => {
                this.selectedDate.year = eval(date_box.dataset.year);
                this.selectedDate.month = eval(date_box.dataset.month);
                this.selectedDate.week = eval(date_box.dataset.week);
                this.selectedDate.day = eval(date_box.dataset.day);
                this.config.view = 1;
                this.init();
              });
              this.template.querySelector(".date_container").append(date_box);
              this.template.querySelector(
                `.eventContainer[id="${index}"]`
              ).dataset.day = next_dates[indexNext];
              this.CheckForEvents(
                next_dates[indexNext],
                this.selectedDate.month == 11
                  ? this.selectedDate.year + 1
                  : this.selectedDate.year,
                this.selectedDate.month + 1 >= 12
                  ? 0
                  : this.selectedDate.month + 1,
                index
              );
            }
          }
        }
      });
  }
  getDay() {
    this.template
      .querySelectorAll(".EventweeksOnly")
      .forEach((ele) => ele.remove());
    this.template
      .querySelector(".firstEventContainer")
      .classList.add("col-span-7");

    this.template
      .querySelector(".weeksOnly")
      .querySelectorAll("*")
      .forEach((ele, index) => {
        if (index == 0) return;
        ele.remove();
      });
    this.template.querySelector(".next").addEventListener("click", () => {
      let weeks = getWeeksInMonth(
        this.selectedDate.year,
        this.selectedDate.month
      );

      if (
        !weeks[this.selectedDate.week].dates.find(
          (date) => date == this.selectedDate.day + 1
        )
      ) {
        if (!weeks[this.selectedDate.week + 1]) {
          if (this.selectedDate.month + 1 > 11) {
            this.selectedDate.month = 0;
            this.selectedDate.year++;
            this.selectedDate.week = 0;
            let weeks = getWeeksInMonth(
              this.selectedDate.year,
              this.selectedDate.month
            );
            this.selectedDate.day = weeks[0].dates[0];
          } else {
            this.selectedDate.month++;
            this.selectedDate.week = 0;
            let weeks = getWeeksInMonth(
              this.selectedDate.year,
              this.selectedDate.month
            );

            this.selectedDate.day = weeks[0].dates[0];
          }
        } else {
          this.selectedDate.week++;
          this.selectedDate.day++;
        }
      } else {
        this.selectedDate.day++;
      }

      this.init();
    });

    this.template.querySelector(".back").addEventListener("click", () => {
      let weeks = getWeeksInMonth(
        this.selectedDate.year,
        this.selectedDate.month
      );

      if (
        !weeks[this.selectedDate.week].dates.find(
          (date) => date == this.selectedDate.day - 1
        )
      ) {
        if (!weeks[this.selectedDate.week - 1]) {
          if (this.selectedDate.month - 1 < 0) {
            this.selectedDate.month = 11;
            this.selectedDate.year--;
            let weeks = getWeeksInMonth(
              this.selectedDate.year,
              this.selectedDate.month
            );
            this.selectedDate.week = weeks.length - 1;

            this.selectedDate.day =
              weeks[weeks.length - 1].dates[
                weeks[weeks.length - 1].dates.length - 1
              ];
          } else {
            this.selectedDate.month--;
            let weeks = getWeeksInMonth(
              this.selectedDate.year,
              this.selectedDate.month
            );
            this.selectedDate.week = weeks.length - 1;

            this.selectedDate.day =
              weeks[weeks.length - 1].dates[
                weeks[weeks.length - 1].dates.length - 1
              ];
          }
        } else {
          this.selectedDate.week--;
          this.selectedDate.day--;
        }
      } else {
        this.selectedDate.day--;
      }

      this.init();
    });

    let weeks = getWeeksInMonth(
      this.selectedDate.year,
      this.selectedDate.month
    );
    if (weeks[this.selectedDate.week].end < this.selectedDate.day) {
      this.selectedDate.week++;
    }
    weeks[this.selectedDate.week].dates.forEach((date, index) => {
      if (this.selectedDate.day == date) {
        if (weeks[this.selectedDate.week].dates.length < 7) {
          let ProcWeeks = getWeeksInMonth(
            this.selectedDate.year,
            weeks[this.selectedDate.week].dates[0] == 1
              ? this.selectedDate.month - 1
              : this.selectedDate.month
          );
          Array()
            .concat(
              ProcWeeks[ProcWeeks.length - 1].dates,
              getWeeksInMonth(
                this.selectedDate.year,
                weeks[this.selectedDate.week].dates[0] == 1
                  ? this.selectedDate.month
                  : this.selectedDate.month + 1
              )[0].dates
            )
            .forEach((currDate, currIndex) => {
              if (currDate == date) return (index = currIndex);
            });
        }
        let shifted = false;
        if (weeks[0].dates.length < 7) {
          weeks.shift();
          shifted = true;
        }
        let date_box = parseHtml(/*html*/ `
        <div data-year="${this.selectedDate.year}" data-month="${
          this.selectedDate.month
        }" data-week="${
          shifted
            ? this.selectedDate.week - 1 < 0
              ? this.selectedDate.week
              : this.selectedDate.week - 1
            : this.selectedDate.week
        }" data-day="${date}" class="date_box_alone hover:bg-green-50 cursor-pointer duration-300 ease-in-out transition-all flex-1 flex gap-2 sm:px-12 px-8 py-4 justify-start items-center border-l-1 border-gray-100 text-center">
            <span class="text-gray-500">${dayNames_short[index]}</span>
            <span class="font-bold p-2 ${
              this.selectedDate.year == this.date.year &&
              this.selectedDate.month == this.date.month &&
              date == this.date.day
                ? " active_day"
                : "w-8 h-8 text-center flex justify-center items-center"
            }">${date}</span>
        </div>
      `);
        if (!isMobile()) {
          date_box.addEventListener("click", () => {
            this.selectedDate.year = eval(date_box.dataset.year);
            this.selectedDate.month = eval(date_box.dataset.month);
            this.selectedDate.week = eval(date_box.dataset.week);
            this.selectedDate.day = eval(date_box.dataset.day);
            let weeks = getWeeksInMonth(
              this.selectedDate.year,
              this.selectedDate.month
            );

            this.config.view = 0;
            this.init();
          });
        }

        this.template.querySelector(".date_container").append(date_box);
        this.template.querySelector(`.eventContainer`).dataset.day = date;
        this.CheckForEvents(
          date,
          this.selectedDate.year,
          this.selectedDate.month,
          index
        );
      }
    });
  }
  CheckForEvents(date, Year, Month, index) {
    this.Events.forEach((event) => {
      const checkForDays =
        event.date.days.find((day) => day == index) == 0
          ? 1
          : event.date.days.find((day) => day == index);

      if (
        Year >= event.date.from.year &&
        Year <= event.date.to.year &&
        checkForDays
      ) {
        if (event.date.from.year == event.date.to.year) {
          if (event.date.from.month == event.date.to.month) {
            if (
              Month == event.date.from.month &&
              date >= event.date.from.day &&
              date <= event.date.to.day
            ) {
              console.log("same month same year", date);
              this.addEvent(event, date);
            }
          }
          if (event.date.from.month != event.date.to.month) {
            if (Month == event.date.from.month && date >= event.date.from.day) {
              console.log("first Month in the same year");
              this.addEvent(event, date);
            }
            if (Month > event.date.from.month && Month < event.date.to.month) {
              console.log("inner Month in the same year");
              this.addEvent(event, date);
            }
            if (Month == event.date.to.month && date <= event.date.to.day) {
              console.log("last Month in the same year");
              this.addEvent(event, date);
            }
          }
        }
        if (event.date.from.year != event.date.to.year) {
          // check for first , inner and last year

          // check for first year should have check for the month
          // check if the month is first , inner , last

          // check for day on the first month
          // dont check for day on the inner month
          // check for last day on the last month

          if (Year == event.date.from.year) {
            console.log("first year");
            if (Month == event.date.from.month && date >= event.date.from.day) {
              console.log("first Month");
              this.addEvent(event, date);
            }
            if (Month > event.date.from.month && Month < event.date.to.month) {
              console.log("inner Month in the same year");
              this.addEvent(event, date);
            }
            if (Month == event.date.to.month && date <= event.date.to.day) {
              console.log("last Month in the same year");
              this.addEvent(event, date);
            }
          }
          if (Year > event.date.from.year && Year < event.date.to.year) {
            this.addEvent(event, date);
          }
          if (Year == event.date.to.year) {
            // fix this pls :)
            if (Month == event.date.to.month && date <= event.date.to.day) {
              console.log("last Month in the same year");
              this.addEvent(event, date);
            }
            if (Month < event.date.to.month) {
              console.log("inner Month in the same year", Month);
              this.addEvent(event, date);
            }
          }
        }
        //   if (this.selectedDate.year == event.date.from.year) {
        //     console.log("first");
        //     if (Month == event.date.from.month && date >= event.date.from.day) {
        //       console.log(date);
        //       this.addEvent(event, date);
        //     }
        //     if (
        //       Month > event.date.from.month &&
        //       Month <= event.date.to.month &&
        //       date <= event.date.to.day
        //     ) {
        //       console.log(date);
        //       this.addEvent(event, date);
        //     }
        //   }

        //   // inner Year
        //   if (
        //     this.selectedDate.year > event.date.from.year &&
        //     this.selectedDate.year != event.date.to.year
        //   ) {
        //     console.log("inner");
        //   }
        //   // To (last) Year
        //   if (this.selectedDate.year == event.date.to.year) {
        //     console.log("last");
        //   }
        // }

        // if (event.date.from.month != event.date.to.month) {
        //   if (Month == event.date.from.month && date >= event.date.from.day) {
        //     this.addEvent(Event, date);
        //   }
        //   if (Month > event.date.from.month && Month != event.date.to.month) {
        //     this.addEvent(Event, date);
        //   }
        //   if (Month == event.date.to.month && date <= event.date.to.day) {
        //     this.addEvent(Event, date);
        //   }
        // }
        // if (
        //   event.date.from.month == event.date.to.month &&
        //   Month == event.date.from.month &&
        //   date >= event.date.from.day &&
        //   date <= event.date.to.day
        // ) {
        //   this.addEvent(Event, date);
        // }
      }
    });
  }
  addEvent(event, date) {
    let start = convertTime12to24(event.date.time.start).split(":");
    start[0] = parseInt(start[0]);
    start[1] = parseInt(start[1]) * (100 / 60);
    // start = start.reduce((prev, curr) =>
    //   parseInt(prev.toString() + (curr == 0 ? "00" : curr.toString()))
    // );
    start = start[0] * 100 + start[1];

    let end = convertTime12to24(event.date.time.end).split(":");
    end[0] = parseInt(end[0]);
    end[1] = parseInt(end[1]) * (100 / 60);
    // end = end.reduce((prev, curr) =>
    //   parseInt(prev.toString() + (curr == 0 ? "00" : curr.toString()))
    // );
    end = end[0] * 100 + end[1];
    console.log(`before ${end}`);
    end = end - start;
    console.log(`after ${end}`);

    let event_box = parseHtml(/*html*/ `
                  <div id="${event?.event_id}" class="${
      event?.color ? event?.color : "bg-gray-200"
    } rounded-lg absolute w-full p-3" style="top: ${start + 5}px; height: ${
      end - 10
    }px; word-wrap: break-word;">
                    <span class="text-sm block text-gray-600">${convertTime24to12(
                      event.date.time.start
                    )} ${
      event.date.time.start.split(" ")[1]
    } - ${convertTime24to12(event.date.time.end)} ${
      event.date.time.end.split(" ")[1]
    }</span> 
                    <span class="text-lg">${event.title}</span>
                  </div>
          `);
    this.template
      .querySelector(`.eventContainer[data-day="${date}"]`)
      .append(event_box);
    event_box.addEventListener("click", (e) => {
      this.onEditEvent(event_box.id, e);
    });
  }
}
