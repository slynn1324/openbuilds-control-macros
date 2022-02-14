// OpenBuilds Control Macro
// Interface Customizations
//   supported version: OpenBuilds Control v1.0.312


// add a custom stylesheet with a custom hide class
// the .hide()/.show() functions are called elsewhere, so this class will override the display state
$("head").append('<style type="text/css">.sl-hide { display: none!important; }</style>');


// to enable/disable our custom buttons we need to track the connectionStatus 
// similarly to how it is tracked in websocket.js.  However, the socket does
// not seem to be initialized when the macro first runs, so we need to wait 
// for it to be defined before we can register a listener.
function waitForSocket(){
  if ( window.socket != undefined ){
    socket.on('status', (status) => { 
      let connectionStatus = status.comms.connectionStatus;

      if ( connectionStatus == 0 ){
        $(".sl-actionButton").hide();
      } else {
        $(".sl-actionButton").show();
      }

      if ( connectionStatus == 1 || connectionStatus == 2 ){
        $(".sl-actionButton").prop('disabled', false);
      } else {
        $(".sl-actionButton").prop('disabled', true);
      }
    });
  } else {
    setTimeout(waitForSocket, 250);
  }
}
waitForSocket();

// function to invoke jogging command.  use jogging to move to ZMax so that the G53 is limited to this jogging command, 
// and does not affect the overall machine coordinate settings.
window.goToZMax = () => { 
  socket.emit("runJob", {
     data: '$J=G53 Z-1 F1000',
     isJob: false
  });
};



// define custom buttons

var sl_spindleOnBtn = `<button id="sl_spindleOnBtn" class="ribbon-button sl-actionButton" onclick="sendGcode('M3 S1000');">
                 <span class="icon">
                   <span class="fa-layers fa-fw">
                    <i class="fas fa-bookmark" data-fa-transform="rotate-180"></i>
                    <i class="fas fa-screwdriver" data-fa-transform="rotate-135 down-3"></i>
                    <i class="fas fa-check fg-green" data-fa-transform="down-3"></i>
                   </span>
                 </span>
                 <span class="caption grblmode">Spindle On</span>
               </button>`;

var sl_spindleOffBtn = `<button id="sl_spindleOffBtn" class="ribbon-button sl-actionButton" onclick="sendGcode('M5');">
                 <span class="icon">
                   <span class="fa-layers fa-fw">
                     <i class="fas fa-bookmark" data-fa-transform="rotate-180"></i>
                     <i class="fas fa-screwdriver" data-fa-transform="rotate-135 down-3"></i>
                     <i class="fas fa-times fg-red" data-fa-transform="down-3"></i>
                   </span>
                 </span>
                 <span class="caption grblmode">Spindle Off</span>
               </button>`;

var sl_probeZBtn = `<button id="sl_probeZBtn" class="ribbon-button sl-actionButton" onclick="openProbeZDialog();">
                 <span class="icon">
                   <span class="fa-layers fa-fw">
                     <i class="fas fa-podcast fa-rotate-180"></i>
                   </span>
                 </span>
                 <span class="caption grblmode">Probe Z</span>
               </button>`;     

var sl_g28btn = `<button id="sl_g28btn" class="ribbon-button sl-actionButton" onclick="sendGcode('G28');">
                 <span class="icon">
                   <span class="fa-layers fa-fw" style="transform: rotate(-45deg);">
                     <i class="fas fa-arrow-alt-circle-left"></i>
                   </span>
                 </span>
                 <span class="caption grblmode">G28</span>
               </button>`;

var sl_g30btn = `<button id="sl_g30btn" class="ribbon-button sl-actionButton" onclick="sendGcode('G30');">
                 <span class="icon">
                   <span class="fa-layers fa-fw" style="transform: rotate(45deg);">
                     <i class="fas fa-arrow-alt-circle-left"></i>
                   </span>
                 </span>
                 <span class="caption grblmode">G30</span>
               </button>`;          

var sl_zMaxBtn = `<button id="sl_zMaxBtn" class="ribbon-button sl-actionButton" onclick="goToZMax();">
                  <span class="icon">
                   <span class="fa-layers fa-fw">
                    <i class="fas fa-angle-double-up"></i>
                   </span>
                  </span>
                  <span class="caption grblmode">Z-Max</span>
                 </button>`;


// place the buttons in the menu bar after the existing buttons
$( "#stopBtn").after( sl_spindleOnBtn );
$( "#sl_spindleOnBtn" ).after( sl_spindleOffBtn );
$( "#sl_spindleOffBtn" ).after( sl_probeZBtn  );
$( "#sl_probeZBtn").after( sl_g28btn );
$( "#sl_g28btn").after(sl_g30btn);
$( "#sl_g30btn" ).after( sl_zMaxBtn );

// hide the default buttons that we don't want to use
$( "#toolBtn").addClass("sl-hide");
$( "#toolBtn2").addClass("sl-hide");
$( "#grblProbeMenu" ).addClass("sl-hide");

// hide the cam tools section - don't use it, just noise.
$(".group.estop").next().addClass("sl-hide");

// hide the window title bar -- I run as a Chrome App due to Linux/Electron issues with freezing, so I don't need a double menu-bar.
$("#windowtitlebar").addClass("sl-hide");

// hide the additional probe tabs - I only probe in the Z direction right now with a touchoff plate.
$("#probeautotab").addClass("sl-hide");
$("#probexyztab").addClass("sl-hide");
$("#probextab").addClass("sl-hide");
$("#probeytab").addClass("sl-hide");
