"use strict";

// Copyright (c) 2017
// Andreas Untergasser. All rights reserved.
// 
//     This file is part of the the Wily DNA Editor suite and libraries.
// 
//     The the Wily DNA Editor suite and libraries are free software;
//     you can redistribute them and/or modify them under the terms
//     of the GNU General Public License as published by the Free
//     Software Foundation; either version 2 of the License, or (at
//     your option) any later version.
// 
//     This software is distributed in the hope that it will be useful,
//     but WITHOUT ANY WARRANTY; without even the implied warranty of
//     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//     GNU General Public License for more details.
// 
//     You should have received a copy of the GNU General Public License
//     along with this software (file gpl-2.0.txt in the source
//     distribution); if not, write to the Free Software
//     Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA
// 
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNERS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

// Set here the Version
var wdeVVersion = "1.2.0";

// Link to Primer3Plus
const uploadTargetP3P = "https://gear.embl.de/primer3plus/api/v1/upload";

// Display Variables
var testInstr = 0;

// Global Variables
var wdeZeroOne = 1;
var wdeNumbers = 1;
var wdeCircular = 1;
var wdeREdisp = 0;
var wdeFEdisp = 0;
var wdeDamDcmSel = 1;
var wdeEnzy = [];
// [][0] = name
// [][1] = sequence
// [][2] = Selected
// [][3] = Number of occurences in sequence
// [][4] = Positions
// [][5] = Dam/Dcm:
//       N = no Dam/Dcm
//       A = Dam
//       C = Dcm
//       D = Dam and Dcm
// [][6] = Cut positions in forward
var wdeUser = [];
// same as wdeEnzy[] with the user seq
var wdeVDigDNACirc;
var wdeDigVBandBlack = 0;
var wdeDigVShowFeatures = 1;
var wdeDigUserChoice = "X";
//  L - Digest as List
//  G - Digest as Gel Pic
//  M - Map
//  U - Map + Unique
//  X - Nothing Selected
var wdeDigSeqNote = {};
//  tag - position
//  val - note string
var wdeTranslate = [];
// [][0] = name
// [][1] = translation
// [][2] = start
var wdeVTransCode = 0;
var wdeVTransFrameNr = 6; // Valid: 1, 3, 6
var wdeVTransLetter = 1; // 0 = 1 Letter As, 1 = 3 Letter As
var wdeVTransRevComp = 1;
var wdeVTransDNA = "";
var wdeVTransDNACirc;
var wdeVTransOrfView = 0;
var wdeVTransOrfSortSize = 1;
var wdeVGBAcc = "";
var wdeVGBDBDate = "";
var wdeVGBHeader = "ACCESSION   \nVERSION     \nSOURCE      .\n  ORGANISM  .\n";
var wdeFeatures = [];
var wdeFeatureLib = [];
// http://www.insdc.org/documents/feature-table
// [][0] = key
// [][1] = location string as in genebank file
// [][2] = tag for display
// [][3] = tag source
//           U = user supplied
//           E = extracted from feature
// [][4] = forward color (D for default)
// [][5] = reverse color (D for default)
// [][6] = draw shape (D for default)
//           A = arrow
//           B = box
// [][7] = Note with wde tags stripped 
// [][8] = all other qualifiers
// [][9] = 1 show feature / 0 hide feature
// [][10] = sequence if used in library function
var wdeFeatureLibTestBu = [];
var wdeFeatColor = [];
// [][0] = key
// [][1] = forward color
// [][2] = reverse color
// [][3] = shape
var wdeFeatRegColor = [];
var wdeFeatInfo = [];
var wdeFeatSelFeat = ["gene","","Enter Feature Name","U","D","D","arrow","","",1,""];
var wdeFeatSelNum = -1;
var wdeLibSelFeat = ["gene","","Enter Feature Name","U","D","D","arrow","","",1,""];
var wdeLibSelNum = -1;
var wdeVFeatTransp = 0;

var wdeSeqHigh = [];
var wdeSeqFeat = [];

var wdeInTestRun = 0;

document.addEventListener("DOMContentLoaded", function() {
  wdeActivateStartup();
  browseTabFunctionality('WDE_main_tab');
});

// Display Functions
window.browseTabFunctionality = browseTabFunctionality;
function browseTabFunctionality(tab) {
  browseTabSelect(tab,'WDE_sel_main_tab','WDE_main_tab');
  browseTabSelect(tab,'WDE_sel_restriction_sites','WDE_restriction_sites');
  browseTabSelect(tab,'WDE_sel_digest','WDE_digest');
  browseTabSelect(tab,'WDE_sel_translate','WDE_translate');
  browseTabSelect(tab,'WDE_sel_features','WDE_features');
  browseTabSelect(tab,'WDE_sel_feature_lib','WDE_feature_lib');
  browseTabSelect(tab,'WDE_sel_Settings','WDE_settings');
}

function browseTabSelect(sel,btn,tab) {
  var button = document.getElementById(btn);
  var tabField = document.getElementById(tab);
  if (sel == tab) {
    button.style.background="rgb(255, 255, 230)";
    button.style.position="relative";
    button.style.top="2px";
    button.style.zIndex="1";
    tabField.style.display="inline";
  } else {
    button.style.background="white";
    button.style.position="static";
    button.style.top="0px";
    button.style.zIndex="0";
    tabField.style.display="none";
  }
}

window.wdeLoadTestSeq = wdeLoadTestSeq;
function wdeLoadTestSeq(size) {
    window.frames['WDE_TEST_OUT'].document.body.innerHTML = "<pre>\nLoading Test Scripts...\n</pre>";
    wdeLoadTestScripts();
    if (size == "SF") {
        wdeKeepTryingFunction("wdeTestLoadSmallSeq", "");
    } 
    if (size == "LF")  {
        wdeKeepTryingFunction("wdeTestLoadLargeSeq", "");
    }
    if (size == "SG")  {
        wdeKeepTryingFunction("wdeTestLoadSmallGeneBank", "");
    }
    if (size == "LG")  {
        wdeKeepTryingFunction("wdeTestLoadLargeGeneBank", "");
    }
    if (size == "TG")  {
        wdeKeepTryingFunction("wdeTestForLargeGB", "");
    }
    if (size == "TA")  {
        wdeResetInterface();
        wdeKeepTryingAllTests();
    }
}

window.wdeKeepTryingFunction = wdeKeepTryingFunction;
function wdeKeepTryingFunction(funct, cont) {
    try {
        eval(funct + "(" + cont + ");");
    } 
    catch (e) {
        setTimeout(function() { wdeKeepTryingFunction(funct, cont); }, 50);
    }
}

window.wdeKeepTryingAllTests = wdeKeepTryingAllTests;
function wdeKeepTryingAllTests() {
    try {
        wdeTestAll();
    } 
    catch (e) {
        if ((e.name == "ReferenceError") && 
            (/wdeTestAll/.test(e.message)) && 
            ((/(un|not )defined/.test(e.message)) ||
             (/find variable/.test(e.message)))) {
            setTimeout(function() { wdeKeepTryingAllTests(); }, 50);
        } else {
            alert(e.name + ":\n" + e.message);
        }
    }
}

window.wdeLoadTestScripts = wdeLoadTestScripts;
function wdeLoadTestScripts() {
    if (testInstr == 0) {
	    var scriptBlock = document.createElement('script');
        scriptBlock.setAttribute("type","text/javascript");
        scriptBlock.setAttribute("src", "static/js/wilyDNAEditorTestSuite.js");
        document.getElementsByTagName("head")[0].appendChild(scriptBlock);
		testInstr = 1;
	}
}

window.wdeDetectBorwser = wdeDetectBorwser;
function wdeDetectBorwser() {
    var browser = window.navigator.userAgent.toLowerCase();
    if (browser.indexOf("edge") != -1) {
        return "edge";
    }
    if (browser.indexOf("firefox") != -1) {
        return "firefox";
    }
    if (browser.indexOf("chrome") != -1) {
        return "chrome";
    }
    if (browser.indexOf("safari") != -1) {
        return "safari";
    }
    alert("Unknown Browser: Functionality may be impaired!\n\n" +browser);
    return browser;
}

// Wily Functions
window.wdeVersion = wdeVersion;
function wdeVersion(){
    var version = "Wily DNA Editor - Version: " + wdeVVersion;
    document.getElementById("WDE_VERSION").innerHTML = version;
}

window.wdeTestAlert = wdeTestAlert;
function wdeTestAlert(){
    alert("WDE-Alert");
}

window.wdeActivateStartup = wdeActivateStartup;
function wdeActivateStartup(){
    window.frames['WDE_RTF'].document.designMode = 'On';
    window.frames['WDE_RTF'].document.body.setAttribute("spellcheck", "false");
    wdeUser = ["User_Seq", "AGC^MGCT", 0 , "-", "", "N", ""];
    wdeUpdateButtonsToDef(0);
    var fileLoad = document.getElementById("WDE_Load_File");
    fileLoad.addEventListener("change", wdeLoadFile, false);
    var fileLoad2 = document.getElementById("WDE_Load_Settings");
    fileLoad2.addEventListener("change", wdeLoadSetFile, false);
    var fileLoad3 = document.getElementById("WDE_Load_Lib_File");
    fileLoad3.addEventListener("change", wdeLoadLibFile, false);
    window.frames['WDE_RTF'].document.addEventListener('cut', wdeCutEvent);
    window.frames['WDE_RTF'].document.addEventListener('copy', wdeCopyEvent);
    window.frames['WDE_RTF'].document.addEventListener('paste', wdePasteEvent);
    window.frames['WDE_RTF'].document.addEventListener('keydown', wdeKeyPressEvent, false);
    window.frames['WDE_RTF'].document.addEventListener('keyup', wdeKeyUpEvent, false);
    window.mKeyCtrl = false;
    window.mKeyUpper = false;
    wdePopulateEnzmes();
    wdePopulateTranslation();
    wdePopulateFeatureColors();
    wdeFeatFocUpdate(-1);
    wdeDrawGeneticCode();
    wdeDrawEnzymes();
    wdeLoadLocalStorage('S');
    wdeLibFocUpdate(-1);
    wdeCleanInputFields();
}

window.wdeSaveSetFile = wdeSaveSetFile;
function wdeSaveSetFile() {
    var content = wdeSettingsToString();
    var fileName = "Wily_DNA_Editor_Settings.txt";
    wdeSaveFile(fileName, content, "text");
}

window.wdeLoadLocalStorage = wdeLoadLocalStorage;
function wdeLoadLocalStorage(){
    var ret = localStorage.getItem("wde_cmdZeroOneButton");
    if (ret !== null) {
        if (ret == "0") {
	        wdeTGViewZeroOne(0,0,0);
	    } else {
	        wdeTGViewZeroOne(1,0,0);
	    }
    }
    ret = localStorage.getItem("wde_wdeDamDcmSel");
    if (ret !== null) {
        if (ret == "0") {
	        wdeTGDamDcm(0,0);
	    } else {
	        wdeTGDamDcm(1,0);
	    }
    }    
    ret = localStorage.getItem("wde_RESTRICTION_NR");
    if (ret !== null) {
        document.getElementById('RESTRICTION_NR').value = ret;
    }
    ret = localStorage.getItem("wde_RESTRICTION_LIST");
    if (ret !== null) {
        document.getElementById('RESTRICTION_LIST').value = ret;
    }
    ret = localStorage.getItem("wde_USER_NAME");
    if (ret !== null) {
        document.getElementById('WDE_USER_NAME').value = ret;
    }
    ret = localStorage.getItem("wde_USER_SEQ");
    if (ret !== null) {
        document.getElementById('WDE_USER_SEQ').value = ret;
    }
    ret = localStorage.getItem("wde_DIGEST_MARKER");
    if (ret !== null) {
        document.getElementById('WDE_DIGEST_MARKER').value = ret;
    }
    ret = localStorage.getItem("wde_DIGEST_AMOUNT");
    if (ret !== null) {
        document.getElementById('WDE_DIGEST_AMOUNT').value = ret;
    }
    ret = localStorage.getItem("wde_BandBlack");
    if (ret !== null) {
        if (ret == "0") {
	        wdeTGDigGelBandBlack(0,0,0);
	    } else {
	        wdeTGDigGelBandBlack(1,0,0);
	    }
    }    
    ret = localStorage.getItem("wde_FeaturesDigest");
    if (ret !== null) {
        if (ret == "0") {
	        wdeTGDigShowFeatures(0,0,0);
	    } else {
	        wdeTGDigShowFeatures(1,0,0);
	    }
    }    
    ret = localStorage.getItem("wde_ORF_AS_NR");
    if (ret !== null) {
        document.getElementById('ORF_AS_NR').value = ret;
    }
    wdeLoadFeatureLibData();
}

window.wdeLoadFeatureLibData = wdeLoadFeatureLibData;
function wdeLoadFeatureLibData(){
    var ret = localStorage.getItem("wde_FeatureLibData");
    if (ret !== null) {
        wdeFeatureLib = JSON.parse(ret);
    }
    wdeLibFocRepaint();
}

window.wdeSetLocalStorage = wdeSetLocalStorage;
function wdeSetLocalStorage(locId,elem){
    var ret = getHtmlTagValue(elem);
    if (ret !== null) {
        localStorage.setItem(locId, ret);
    }
}

function getHtmlTagValue(tag) {
  var pageElement = document.getElementById(tag);
  if (pageElement !== null) {
    var tagName = pageElement.tagName.toLowerCase();
    if (tagName === 'textarea') {
      return pageElement.value;
    }
    if (tagName === 'select') {
      return pageElement.options[pageElement.selectedIndex].value;
    }
    if (tagName === 'input') {
      var type = pageElement.getAttribute('type').toLowerCase();
      if (type == 'checkbox') {
        if (pageElement.checked == true) {
          return "1";
        } else {
          return "0";
        }
      }
      if ((type == 'text') || (type == 'hidden')) {
        return pageElement.value;
      }
    }
    if (debugMode > 1) {
      alert("warn","Unknown Type by " + tag + " get: " + pageElement.getAttribute('type'));
    }
  } else {
    if (debugMode > 1) {
      alert("warn","Missing element by " + tag + " get!");
    }
  }
  return null;
}

window.wdeLoadSetFile = wdeLoadSetFile;
function wdeLoadSetFile(f){
    var file = f.target.files[0];
    if (file) { // && file.type.match("text/*")) {
        var reader = new FileReader();
        reader.onload = function(event) {
            var txt = event.target.result;
            var regEx1 = /\r\n/g;
            txt = txt.replace(regEx1, "\n");
            wdeStringToSettings(txt);
        }
        reader.readAsText(file);
    } else {
        alert("Error opening file");
    }
}

window.wdeSettingsToString = wdeSettingsToString;
function wdeSettingsToString(){
    var txt = "";
    txt += "Index=" + wdeZeroOne + "\n";
    txt += "DamDcm=" + wdeDamDcmSel + "\n";
    var rsNr = document.getElementById('RESTRICTION_NR').value;
    txt += "RESel=" + rsNr + "\n";
    var rawList = document.getElementById('RESTRICTION_LIST').value;
    txt += "REList=" + rawList + "\n";
    var uName = document.getElementById('WDE_USER_NAME').value;
    txt += "USName=" + uName + "\n";
    var uSeq = document.getElementById('WDE_USER_SEQ').value;
    txt += "USSeq=" + uSeq + "\n";
    var markString = document.getElementById('WDE_DIGEST_MARKER').value;
    txt += "Marker=" + markString + "\n";
	var amount = document.getElementById('WDE_DIGEST_AMOUNT').value;
    txt += "Load=" + amount + "\n";
    txt += "BandBlack=" + wdeDigVBandBlack + "\n";
    txt += "FeaturesDigest=" + wdeDigVShowFeatures + "\n";
    var minSize = document.getElementById('ORF_AS_NR').value;
    txt += "minORF=" + minSize + "\n";
    return txt;
}

window.wdeStringToSettings = wdeStringToSettings;
function wdeStringToSettings(txt){
    txt = txt.replace(/\r\n/g, "\n");
    var all = txt.split("\n");
    for (var i = 0; i < all.length; i++) {
        var line = all[i].split("=");
        if (line.length == 2) {
            if (line[0] == "Index") {
			    if (line[1] == "0") {
			        wdeTGViewZeroOne(0,0,1);
			    } else {
			        wdeTGViewZeroOne(1,0,1);
			    }
            }
            if (line[0] == "DamDcm") {
			    if (line[1] == "0") {
			        wdeTGDamDcm(0,1);
			    } else {
			        wdeTGDamDcm(1,1);
			    }
            }
            if (line[0] == "RESel") {
			    document.getElementById('RESTRICTION_NR').value = line[1];
                wdeSetLocalStorage('wde_RESTRICTION_NR','RESTRICTION_NR');
            }
            if (line[0] == "REList") {
			    document.getElementById('RESTRICTION_LIST').value = line[1];
                wdeSetLocalStorage('wde_RESTRICTION_LIST','RESTRICTION_LIST');
            }
            if (line[0] == "USName") {
			    document.getElementById('WDE_USER_NAME').value = line[1];
                wdeSetLocalStorage('wde_USER_NAME','WDE_USER_NAME');
            }
            if (line[0] == "USSeq") {
			    document.getElementById('WDE_USER_SEQ').value = line[1];
                wdeSetLocalStorage('wde_USER_SEQ','WDE_USER_SEQ');
            }
            if (line[0] == "Marker") {
			    document.getElementById('WDE_DIGEST_MARKER').value = line[1];
                wdeSetLocalStorage('wde_DIGEST_MARKER','WDE_DIGEST_MARKER');
            }
            if (line[0] == "Load") {
			    document.getElementById('WDE_DIGEST_AMOUNT').value = line[1];
                wdeSetLocalStorage('wde_DIGEST_AMOUNT','WDE_DIGEST_AMOUNT');
            }
            if (line[0] == "BandBlack") {
			    if (line[1] == "0") {
			        wdeTGDigGelBandBlack(0,0,1);
			    } else {
			        wdeTGDigGelBandBlack(1,0,1);
			    }
            }
            if (line[0] == "FeaturesDigest") {
			    if (line[1] == "0") {
			        wdeTGDigShowFeatures(0,0,1);
			    } else {
			        wdeTGDigShowFeatures(1,0,1);
			    }
            }
            if (line[0] == "minORF") {
			    document.getElementById('ORF_AS_NR').value = line[1];
                wdeSetLocalStorage('wde_ORF_AS_NR','ORF_AS_NR');
            }
        }
    }
}

window.wdeResetInterface = wdeResetInterface;
function wdeResetInterface(){
    var defSet = 'Index=1\nDamDcm=1\nRESel=2\nREList=KpnI, BstBI, HindIII, BamHI\nUSName=User_Seq\nUSSeq=AGC^MGCT\n';
    defSet += 'Marker=10000,50;8000,50;6000,50;5000,50;4000,50;3000,150;2000,50;1500,50;1200,50;1000,150;900,50;800,50;700,50;600,50;500,150;400,50;300,50;200,50;100,50\n';
    defSet += 'Load=500\nBandBlack=0\nFeaturesDigest=1\nminORF=10\n';
    wdeStringToSettings(defSet);
}

window.wdeDeleteLocalStorage = wdeDeleteLocalStorage;
function wdeDeleteLocalStorage(){
    localStorage.clear(); 
}

window.wdeRepaint = wdeRepaint;
function wdeRepaint(){
    window.frames['WDE_RTF'].document.body.innerHTML = wdeFormatSeq(wdeCleanSeq(window.frames['WDE_RTF'].document.body.innerHTML), wdeZeroOne, wdeNumbers);
}

window.wdeCopyEvent  = wdeCopyEvent ;
function wdeCopyEvent (e) {
    e.stopPropagation();
    e.preventDefault();
    var selection = wdeCleanSeq(window.frames['WDE_RTF'].getSelection().toString());
    e.clipboardData.setData('text/plain', selection);
}

window.wdeCutEvent  = wdeCutEvent ;
function wdeCutEvent (e) {
    e.stopPropagation();
    e.preventDefault();
    var sel, range;
    if (window.frames['WDE_RTF'].getSelection) {
        sel = window.frames['WDE_RTF'].getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            var pureSelection = wdeCleanSeq(range.toString());
            if (pureSelection < 1) {
                return;
            }
            e.clipboardData.setData('text/plain', pureSelection);
            var theSelection = "X" + pureSelection + "X";
            range.deleteContents();
            range.insertNode(window.frames['WDE_RTF'].document.createTextNode(theSelection));
	        var seqWSel = wdeCleanSeqWithMarks(window.frames['WDE_RTF'].document.body.innerHTML);
	        var loc = [];
	        var locCount = 0;
	        for (var i = 0; i < seqWSel.length ; i++) {
	            if (seqWSel.charAt(i) == "X") {
	                loc[loc.length] = locCount;
	            } else  {
	                locCount++;
	            } 
	        }
	        seqWSel = seqWSel.replace(/x.+x/ig, "");
	        window.frames['WDE_RTF'].document.body.innerHTML = wdeFormatSeq(seqWSel, wdeZeroOne, wdeNumbers);
            // We have the split positions, now split the features they span
	        wdeFeatSplitAtLoc(loc[0]);
	        wdeFeatSplitAtLoc(loc[1]);
            // Now delete the features between the locations
            wdeFeatModifyBetween((loc[0] + 1),loc[1],"D");
            // Do the shift
            var shiftDiff = loc[0] - loc[1];
            wdeFeatShiftAfterLoc(loc[1],shiftDiff);
            // Sort the feature list
            wdeSequenceModified();
            wdeFeatures.sort(wdeFeatListSort);
	        wdeFeatFocRepaint();
	        wdeRepaint();
        }
    }
}

window.wdePasteEvent  = wdePasteEvent ;
function wdePasteEvent (e) {
    e.stopPropagation();
    e.preventDefault();
    var toPaste = wdeCleanSeq(e.clipboardData.getData('text/plain'));
    var sel, range;
    if (window.frames['WDE_RTF'].getSelection) {
        sel = window.frames['WDE_RTF'].getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            var theSelection = "X" + range.toString() + "X";
            range.deleteContents();
            range.insertNode(window.frames['WDE_RTF'].document.createTextNode(theSelection));
	        var seqWSel = wdeCleanSeqWithMarks(window.frames['WDE_RTF'].document.body.innerHTML);
	        var loc = [];
	        var locCount = 0;
	        for (var i = 0; i < seqWSel.length ; i++) {
	            if (seqWSel.charAt(i) == "X") {
	                loc[loc.length] = locCount;
	            } else  {
	                locCount++;
	            } 
	        }
	        seqWSel = seqWSel.replace(/x.*x/ig, toPaste);
	        window.frames['WDE_RTF'].document.body.innerHTML = wdeFormatSeq(seqWSel, wdeZeroOne, wdeNumbers);
            // We have the split positions, now split the features they span
	        wdeFeatSplitAtLoc(loc[0]);
	        wdeFeatSplitAtLoc(loc[1]);
            // Now delete the features between the locations
            wdeFeatModifyBetween((loc[0] + 1),loc[1],"D");
            // Do the shift
            var shiftDiff = loc[0] - loc[1] + toPaste.length;
            wdeFeatShiftAfterLoc(loc[1],shiftDiff);
            // Sort the feature list
            wdeSequenceModified();
            wdeFeatures.sort(wdeFeatListSort);
	        wdeFeatFocRepaint();
	        wdeRepaint();
        }
    }
}

window.wdeKeyUpEvent = wdeKeyUpEvent;
function wdeKeyUpEvent(e) {
    var sel, range;
    e = e || WDE_RTF.contentWindow.event;
    var charCode = e.keyCode || e.which;
    if (charCode == 16) {
        window.mKeyUpper = false;
    }
    if (charCode == 17) {
        window.mKeyCtrl = false;
    }
}

window.wdeKeyPressEvent = wdeKeyPressEvent;
function wdeKeyPressEvent(e) {
    var sel, range;
    e = e || WDE_RTF.contentWindow.event;
    var charCode = e.keyCode || e.which;
    var charTyped = wdeRetAmbiqutyOnly(String.fromCharCode(charCode));
    if (!(window.mKeyUpper)) {
        charTyped = charTyped.toLowerCase()
    }
    if ((window.frames['WDE_RTF'].getSelection) && !(window.mKeyCtrl)) {
        sel = window.frames['WDE_RTF'].getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            var delPart = 0;
            var rangeBefore = document.createRange();
            var referenceNode = window.frames['WDE_RTF'].document.getElementById("wdeStartNode");
            rangeBefore.setStartBefore(referenceNode);
            rangeBefore.setEnd(range.startContainer,range.startOffset);
            var beforeStr = rangeBefore.toString();
            var posMark = wdeCleanSeq(beforeStr).length;
		    if (charCode == 8) {
		        // Match backspace
			    wdeFeatSplitAtLoc(posMark);
	            if (!(range.collapsed)) {
	                delPart = wdeCleanSeq(range.toString()).length;
	                wdeFeatSplitAtLoc(posMark + delPart);
	                wdeFeatModifyBetween((posMark + 1),(posMark + delPart),"D");
	                wdeFeatShiftAfterLoc((posMark + delPart),( - delPart));
	                range.deleteContents();
	                e.stopPropagation();
			        e.preventDefault();
	            } else {
	                var lastLetter = wdeCleanSeq(beforeStr.charAt(beforeStr.length - 1));
	                if (lastLetter != "") {
				        wdeFeatSplitAtLoc(posMark - 1);
		            	range.deleteContents();
		                wdeFeatModifyBetween((posMark),(posMark + 1),"D");
		                wdeFeatShiftAfterLoc((posMark - 1), -1);
		            }
	            }         
		    } else if (charCode == 46) {
		        // Match del
			    wdeFeatSplitAtLoc(posMark);
	            if (!(range.collapsed)) {
	                delPart = wdeCleanSeq(range.toString()).length;
	                wdeFeatSplitAtLoc(posMark + delPart);
	                wdeFeatModifyBetween((posMark + 1),(posMark + delPart),"D");
	                wdeFeatShiftAfterLoc((posMark + delPart),( - delPart));
	                range.deleteContents();
	                e.stopPropagation();
			        e.preventDefault();
	            } else {
	                var lastLetter = wdeCleanSeq(beforeStr.charAt(beforeStr.length - 1));
	                if (lastLetter != "") {
				        wdeFeatSplitAtLoc(posMark);
		            	range.deleteContents();
		                wdeFeatModifyBetween((posMark + 1),(posMark + 2),"D");
		                wdeFeatShiftAfterLoc((posMark + 1), -1);
		            }
	            }
		    } else if (charCode == 16) {
                window.mKeyUpper = true;
		    } else if (charCode == 17) {
		        window.mKeyCtrl = true;
		    } else if ((charCode >= 33) && (charCode <=40)) {
		        // Match move commands
		        // Nothing to do...    
		    } else { 
			    e.stopPropagation();
			    e.preventDefault();
			    if ((charTyped === "X") || (charTyped === "x")) {
			        charTyped = "";
			    }
		        if (charTyped != "") {
				    wdeFeatSplitAtLoc(posMark);
		            if (!(range.collapsed)) {
		                delPart = wdeCleanSeq(range.toString()).length;
		                wdeFeatSplitAtLoc(posMark + delPart);
		                wdeFeatModifyBetween((posMark + 1),(posMark + delPart),"D");
		                wdeFeatShiftAfterLoc((posMark + delPart),( - delPart));
		            }            
		            range.deleteContents();
		            wdeFeatShiftAfterLoc(posMark, 1);
		            var textNode = document.createTextNode(charTyped);
		            range.insertNode(textNode);
		            // Move caret to the end of the newly inserted text node
		            range.setStart(textNode, textNode.length);
		            range.setEnd(textNode, textNode.length);
		            sel.removeAllRanges();
		            sel.addRange(range);
			    }
		    }
            wdeSequenceModified();
            wdeFeatures.sort(wdeFeatListSort);
	        wdeFeatFocRepaint();
        }
    } else if (window.mKeyCtrl) {
        // let the things happen
    } else {
	    e.stopPropagation();
	    e.preventDefault();    
    }
}

window.wdeSendP3P = wdeSendP3P;
function wdeSendP3P(){
  var form = document.createElement("form");
  form.setAttribute("method", "post");
  form.setAttribute("action", uploadTargetP3P);
  form.setAttribute("target", "_blank");
  var params = {};
  params['SEQUENCE_ID'] = getHtmlTagValue('SEQUENCE_ID');
  params['SEQUENCE_TEMPLATE'] = wdeCleanSeq(window.frames['WDE_RTF'].document.body.innerHTML);
  for(var key in params) {
    if(params.hasOwnProperty(key)) {
      var hiddenField = document.createElement("input");
      hiddenField.setAttribute("type", "hidden");
      hiddenField.setAttribute("name", key);
      hiddenField.setAttribute("value", params[key]);
      form.appendChild(hiddenField);
    }
  }
  document.body.appendChild(form);
  form.submit();
}

window.wdeNewWindow = wdeNewWindow;
function wdeNewWindow(){
    var win = window.open("index.html", '_blank');
    win.focus();
}

window.wdeLoadFile = wdeLoadFile;
function wdeLoadFile(f){
    var file = f.target.files[0];
    if (file) { // && file.type.match("text/*")) {
        var reader = new FileReader();
        reader.onload = function(event) {
            var txt = event.target.result;
            var regEx1 = /\r\n/g;
            txt = txt.replace(regEx1, "\n");
            window.frames['WDE_RTF'].document.body.innerHTML = wdeFormatSeq(wdeCleanSeq(wdeReadFile(txt, file.name)), wdeZeroOne, wdeNumbers);
        }
        reader.readAsText(file);
    } else {
        alert("Error opening file");
    }
    
}

window.wdeReadFile = wdeReadFile;
function wdeReadFile(seq, file) {
    wdeCleanInputFields();
    wdeFeatures = [];
    wdeSequenceModified();
    // FASTA file format
    if (/^>/.test(seq)) {
        var eoTitel = seq.indexOf("\n");
        var titel = seq.substring(1,eoTitel);
        document.getElementById('SEQUENCE_ID').value = titel;
        eoTitel++;
        return seq.substring(eoTitel, seq.length);
    }
    // Genebank file format
    if (/^LOCUS/.test(seq)) {
	    var gbLin = seq.split("\n");
	    if (/circular/.test(gbLin[0])) {
            wdeTGCircularLinear(1);
	    } else {
            wdeTGCircularLinear(0);
	    }
	    wdeVGBHeader = "";
	    if (/^LOCUS\s+(.+?)\d+ bp/.test(gbLin[0])) {
	    	 wdeVGBAcc = RegExp.$1;
	    }
	    if (/circular\s+(.+$)/.test(gbLin[0])) {
	    	 wdeVGBDBDate = RegExp.$1;
	    } else if (/linear\s+(.+$)/.test(gbLin[0])) {
	    	 wdeVGBDBDate = RegExp.$1;
	    } else {
	         /d+ bp\s+(.+$)/.test(gbLin[0]);
	    	 wdeVGBDBDate = RegExp.$1;
	    }
	    var curHead = "";
	    var curFeat = -1;
	    var curSeq = -1;
	    var curFeatCount = -1;
	    var stillPos = 1;
	    for (var k = 1; k < gbLin.length; k++) {
	        if (/^FEATURES/.test(gbLin[k])) {
	            wdeVGBHeader += curHead;
	            curHead = -1;
	            curFeat = "";
	            continue;
	        }
	        if (/^ORIGIN/.test(gbLin[k])) {
	            curHead = -1;
	            curFeat = -1;
	            curSeq = "";
	            continue;
	        }
	        if (/^\/\//.test(gbLin[k])) {
	            wdeProcessGenebank(wdeFeatures);
	            wdeFeatFocUpdate(-1);
	            return curSeq;
	        }
	        if (/^DEFINITION  /.test(gbLin[k])) {
	            var id = gbLin[k];
	            id = id.replace(/^DEFINITION  /, "");
	            if (id.length > 1) {
	                document.getElementById('SEQUENCE_ID').value = id;
	            } else {
	                document.getElementById('SEQUENCE_ID').value = file;
	            }
	        }
	        if ((curHead != -1) && !(/^DEFINITION  /.test(gbLin[k]))) {
	            curHead += gbLin[k] + "\n";
	        }
	        if (curFeat != -1) {
	            var featKey = gbLin[k].substring(5,21);
	            var featVal = gbLin[k].substring(21);
                if (/[A-Za-z]/g.test(featKey)) {
	                curFeatCount++;
	                featKey = featKey.replace(/\s+/g, "");
	                wdeFeatures[curFeatCount] = [featKey,featVal,"","E","D","D","D","","",1];
	                stillPos = 1;
	            } else {
	                if (/^\//g.test(featVal)) {
	                    stillPos = 0;
	                }
	                if (stillPos == 1) {
	                    wdeFeatures[curFeatCount][1] += featVal;
	                } else {
	                    wdeFeatures[curFeatCount][8] += featVal + "\n";
	                }
	            }
	        }
	        if (curSeq != -1) {
	            curSeq += gbLin[k];
	        }
	    }
    }
    // If nothing works
    document.getElementById('SEQUENCE_ID').value = file;
    return seq;
}

window.wdeProcessGenebank = wdeProcessGenebank;
function wdeProcessGenebank(feat) {
    for (var k = 0; k < feat.length; k++) {
        // Flip join(complement(),complement())
        if(/^join\((complement\(.+)\)\s*$/g.test(feat[k][1])) {
            var locFlip = RegExp.$1;
            locFlip = locFlip.replace(/complement\(/g, "");
            locFlip = locFlip.replace(/\)/g, "");
            var locOrder = locFlip.split(",");
            feat[k][1] = "complement(join(";
            for (var i = locOrder.length - 1 ; i >= 0 ; i--) {
                feat[k][1] += locOrder[i] + ",";
            }
            feat[k][1] = feat[k][1].replace(/,$/, "))");
        }
    
        // Extract the note qualifier
        // Regular Expression . does not match newline use [\s\S] instead
        if (/\/note="[\s\S]+/g.test(feat[k][8])) {
            var noteArr = wdeGenebankExtractNote(feat[k][8]);
            var qNote = noteArr[0];
            feat[k][8] = noteArr[1];
	        if (/forCol\(([^\)]+)\)\s*/g.test(qNote)) {
	            feat[k][4] = RegExp.$1;
	            qNote = qNote.replace(/forCol\(([^\)]+)\)\s*/g, "");
	        }
	        if (/revCol\(([^\)]+)\)\s*/g.test(qNote)) {
	            feat[k][5] = RegExp.$1;
	            qNote = qNote.replace(/revCol\(([^\)]+)\)\s*/g, "");
	        }
	        if (/drawShape\(([^\)]+)\)\s*/g.test(qNote)) {
	            feat[k][6] = RegExp.$1;
	            qNote = qNote.replace(/drawShape\(([^\)]+)\)\s*/g, "");
	        }
	        if (/tag\(([^\)]+)\)\s*/g.test(qNote)) {
	            feat[k][2] = RegExp.$1;
	            feat[k][3] = "U";
	            qNote = qNote.replace(/tag\([^\)]+\)\s*/g, "");
	        }
	        feat[k][7] = qNote;
	        if (feat[k][3] != "U") {
	            /\/note="([\s\S]+?)"/g.test(qNote);
	            feat[k][2] = RegExp.$1;
	        }
        }
        if (feat[k][3] != "U") {
                if (/\/ApEinfo_label="*([^"]+?)"*\n/g.test(feat[k][8])) {
                      feat[k][2] = RegExp.$1;
                }
	        if (/\/allele="([^"]+?)"\s*/g.test(feat[k][8])) {
	              feat[k][2] = RegExp.$1;
	        }
	        if (/\/standard_name="([^"]+?)"\s*/g.test(feat[k][8])) {
	              feat[k][2] = RegExp.$1;
	        }
                if (/\/label="*([^"]+?)"*\n/g.test(feat[k][8])) {
                      feat[k][2] = RegExp.$1;
                }
	        if (/\/product="([^"]+?)"\s*/g.test(feat[k][8])) {
	              feat[k][2] = RegExp.$1;
	        }
	        if (/\/gene="([^"]+?)"\s*/g.test(feat[k][8])) {
	              feat[k][2] = RegExp.$1;
	        }
        }
    }
}

window.wdeGenebankExtractNote = wdeGenebankExtractNote;
function wdeGenebankExtractNote(featStr) {
    var retVal = "";
    var noteVal = "";
    var inNote = 0;
    var firstNote = 1;
    if (featStr.length < 9) {
        alert ("TooShort:\n" + featStr);
        return [noteVal,featStr];
    }
    for (var i = 0; i < featStr.length ; i++) {
        // in nodes are double "" allowed...
        if (inNote && (featStr.charAt(i) == "\"")) {
            if (i == featStr.length - 1) {
                noteVal += "\"";
            } else {
	            if (featStr.charAt(i + 1) == "\"") {
                    noteVal += "\"";
                    i++;
	            } else {
                    inNote = 0;
	            }
            }
        } else {    
	        if ((i < featStr.length - 7) && (featStr.substring(i,(i+7)) == "/note=\"")){
	            i += 6;
	            inNote = 1;
	            if (firstNote) {
	                retVal += "/note=\"Spacer for note information\"";
	                firstNote = 0;
	            }
	        } else {
	            if (inNote == 0) {
	                retVal += featStr.charAt(i);
	            } else {
	                noteVal += featStr.charAt(i);
	            }
	        }
        }
    }
    noteVal = noteVal.replace(/^\s+/, "");
    noteVal = noteVal.replace(/\s+$/, ""); 
    noteVal = "/note=\"" + noteVal + "\"";
    return [noteVal,retVal];
}

window.wdeLoadLibFile = wdeLoadLibFile;
function wdeLoadLibFile(f){
    var file = f.target.files[0];
    if (file) { // && file.type.match("text/*")) {
        var reader = new FileReader();
        reader.onload = function(event) {
            var txt = event.target.result;
            var regEx1 = /\r\n/g;
            txt = txt.replace(regEx1, "\n");
            wdeReadLibFile(txt, file.name);
        }
        reader.readAsText(file);
    } else {
        alert("Error opening library file");
    }
}

window.wdeReadLibFile = wdeReadLibFile;
function wdeReadLibFile(seq, file) {
    var wdeLibFeatures = [];
    // Genebank file format
    if (/^LOCUS/.test(seq)) {
	    var gbLin = seq.split("\n");
	    var curFeat = -1;
	    var curSeq = -1;
	    var curFeatCount = -1;
	    var stillPos = 1;
	    for (var k = 1; k < gbLin.length; k++) {
	        if (/^FEATURES/.test(gbLin[k])) {
	            curFeat = "";
	            continue;
	        }
	        if (/^ORIGIN/.test(gbLin[k])) {
	            curFeat = -1;
	            curSeq = "";
	            continue;
	        }
	        if (/^\/\//.test(gbLin[k])) {
	            wdeProcessGenebank(wdeLibFeatures);
	        }
	        if (curFeat != -1) {
	            var featKey = gbLin[k].substring(5,21);
	            var featVal = gbLin[k].substring(21);
                if (/[A-Za-z]/g.test(featKey)) {
	                curFeatCount++;
	                featKey = featKey.replace(/\s+/g, "");
	                wdeLibFeatures[curFeatCount] = [featKey,featVal,"","E","D","D","D","","",1];
	                stillPos = 1;
	            } else {
	                if (/^\//g.test(featVal)) {
	                    stillPos = 0;
	                }
	                if (stillPos == 1) {
	                    wdeLibFeatures[curFeatCount][1] += featVal;
	                } else {
	                    wdeLibFeatures[curFeatCount][8] += featVal + "\n";
	                }
	            }
	        }
	        if (curSeq != -1) {
	            curSeq += gbLin[k];
	        }
	    }
    }
    curSeq = wdeCleanSeq(curSeq);
    for (var k = 0; k < wdeLibFeatures.length; k++) {
        wdeLibExtractFeature(wdeLibFeatures[k], curSeq);
    }
    wdeFeatureLib.sort(wdeLibListSort);
    localStorage.setItem("wde_FeatureLibData", JSON.stringify(wdeFeatureLib));
    wdeLibFocRepaint();
}

window.wdeSaveGenBank = wdeSaveGenBank;
function wdeSaveGenBank() {
    var seq = wdeCleanSeq(window.frames['WDE_RTF'].document.body.innerHTML);
    var title = document.getElementById('SEQUENCE_ID').value;
    var content = "LOCUS       ";
    content += wdeVGBAcc;
    content += "" + seq.length + " bp    DNA     ";
    if (wdeCircular) {
        content += "circular ";
    } else {
        content += "linear ";
    }
    if (wdeVGBDBDate != "") {
        content += wdeVGBDBDate;
    } else {
        var months = [ "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
                       "JUL", "AUG", "SEP", "OCT", "NOV", "DEC" ];
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth();
        var yy = today.getFullYear();
        content += "      " + dd + "-" + months[mm] + "-" + yy;        
    }
    content += "\n";
    content += "DEFINITION  " + title + "\n";
    content += wdeVGBHeader;
    content += "FEATURES             Location/Qualifiers\n";
    for (var k = 0; k < wdeFeatures.length; k++) {
        var myKey = "     " + wdeFeatures[k][0];
        for (var i = myKey.length ; i < 21 ; i++) {
            myKey += " ";
        }
        content += myKey;
        var myPos = wdeFeatures[k][1].split(",");
        myKey = "";
        for (var i = 0 ; i < myPos.length ; i++) {
            if (myKey.length + myPos[i].length + 1 > 58) {
                content += myKey + "\n                     ";
                myKey = "";
            }
            if (i < myPos.length - 1) {
                myKey += myPos[i] + ",";
            } else {
                if (myKey != "") {
                    content += myKey;
                }
                content += myPos[i] + "\n";
            }
        }
        var finNote = '/note="';
        var myPara = 0;
        if (wdeFeatures[k][4] != "D") {
            finNote +="forCol(" + wdeFeatures[k][4] + ") ";
            myPara = 1;
        }
        if (wdeFeatures[k][5] != "D") {
            finNote +="revCol(" + wdeFeatures[k][5] + ") ";
            myPara = 1;
        }
        if (wdeFeatures[k][6] != "D") {
            finNote +="drawShape(" + wdeFeatures[k][6] + ") ";
            myPara = 1;
        }
        if (wdeFeatures[k][3] == "U") {
            finNote = finNote.replace(/ $/g, "");
            finNote +="\ntag(" + wdeFeatures[k][2] + ")";
            myPara = 1;
        }
        if ((wdeFeatures[k][7] != "") && (wdeFeatures[k][7] != '/note=""')) {
	        if (myPara == 1) {
	            finNote += "\n";
	        }
	        var noteEdit = wdeFeatures[k][7].replace(/\/note=\"\s*/g, "");
	        noteEdit = noteEdit.replace(/"$/, "");
	        noteEdit = noteEdit.replace(/"/g, "\"\"");
            finNote += noteEdit;
        }
        finNote = finNote.replace(/ +$/, "");
        finNote += '"';
        var qualifiers = wdeFeatures[k][8];
        if (/note="/g.test(qualifiers)) {            
            if (finNote != '/note=""') {
                qualifiers = qualifiers.replace(/\/note="[^"]+"/g, finNote);
            } else {
                qualifiers = qualifiers.replace(/\/note="[^"]+"\s*/g, "");
            }
 //     } else if (/gene=""\n/g.test(qualifiers)) {
 //         qualifiers = qualifiers.replace(/\/note=""/g, finNote);
        } else {
            if (finNote != '/note=""') {
                qualifiers = finNote + "\n" + qualifiers;
            }
        }
        var qualArr = qualifiers.split("\n");
        for (var i = 0 ; i < qualArr.length - 1 ; i++) {
            content += "                     " + qualArr[i] + "\n";
        }
    }
    content += "ORIGIN      \n";
    for (var i = 0; i < seq.length ; i++) {
        if (i % 60 == 0) {
            if (i != 0) {
                content += "\n";
            }
            var pIco = i + 1;
            var iStr = pIco.toString();
            for (var j = iStr.length; j < 9 ; j++) {
                content += " ";
            }
            content += iStr + " ";
        } else {
            if (i % 10 == 0) {
                content += " ";
            }
        }
        content += seq.charAt(i);
    }
    content += "\n//\n\n";
    var fileName = title + ".gb";
    return wdeSaveFile(fileName, content, "text");
}

window.wdeSaveLibFile = wdeSaveLibFile;
function wdeSaveLibFile() {
    var seq = "NN";
    var modLocStr = [];
    for (var k = 0; k < wdeFeatureLib.length; k++) {
        var tempArr = wdeLibShiftByFirst(wdeFeatureLib[k][1],seq.length);
        modLocStr[k] = tempArr[0];
        seq += wdeCleanSeq(wdeFeatureLib[k][10]) + "NN";
    }
    var content = "LOCUS       LIBRARY    ";
    content += "" + seq.length + " bp    DNA            ";
    var months = [ "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
                   "JUL", "AUG", "SEP", "OCT", "NOV", "DEC" ];
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth();
    var yy = today.getFullYear();
    content += "      " + dd + "-" + months[mm] + "-" + yy + "\n";
    content += "DEFINITION  Feature Library - Feature collection, not a real sequence\n";
    content += "VERSION     .\n";
    content += "KEYWORDS    .\n";
    content += "FEATURES             Location/Qualifiers\n";
    for (var k = 0; k < wdeFeatureLib.length; k++) {
        var myKey = "     " + wdeFeatureLib[k][0];
        for (var i = myKey.length ; i < 21 ; i++) {
            myKey += " ";
        }
        content += myKey;
        var myPos = modLocStr[k].split(",");
        myKey = "";
        for (var i = 0 ; i < myPos.length ; i++) {
            if (myKey.length + myPos[i].length + 1 > 58) {
                content += myKey + "\n                     ";
                myKey = "";
            }
            if (i < myPos.length - 1) {
                myKey += myPos[i] + ",";
            } else {
                if (myKey != "") {
                    content += myKey;
                }
                content += myPos[i] + "\n";
            }
        }
        var finNote = '/note="';
        var myPara = 0;
        if (wdeFeatureLib[k][4] != "D") {
            finNote +="forCol(" + wdeFeatureLib[k][4] + ") ";
            myPara = 1;
        }
        if (wdeFeatureLib[k][5] != "D") {
            finNote +="revCol(" + wdeFeatureLib[k][5] + ") ";
            myPara = 1;
        }
        if (wdeFeatureLib[k][6] != "D") {
            finNote +="drawShape(" + wdeFeatureLib[k][6] + ") ";
            myPara = 1;
        }
        if (wdeFeatureLib[k][3] == "U") {
            finNote = finNote.replace(/ $/g, "");
            finNote +="\ntag(" + wdeFeatureLib[k][2] + ")";
            myPara = 1;
        }
        if ((wdeFeatureLib[k][7] != "") && (wdeFeatureLib[k][7] != '/note=""')) {
	        if (myPara == 1) {
	            finNote += "\n";
	        }
	        var noteEdit = wdeFeatureLib[k][7].replace(/\/note=\"\s*/g, "");
	        noteEdit = noteEdit.replace(/"$/, "");
	        noteEdit = noteEdit.replace(/"/g, "\"\"");
            finNote += noteEdit;
        }
        finNote = finNote.replace(/ +$/, "");
        finNote += '"';
        var qualifiers = wdeFeatureLib[k][8];
        if (/note="/g.test(qualifiers)) {            
            if (finNote != '/note=""') {
                qualifiers = qualifiers.replace(/\/note="[^"]+"/g, finNote);
            } else {
                qualifiers = qualifiers.replace(/\/note="[^"]+"\s*/g, "");
            }
 //     } else if (/gene=""\n/g.test(qualifiers)) {
 //         qualifiers = qualifiers.replace(/\/note=""/g, finNote);
        } else {
            if (finNote != '/note=""') {
                qualifiers = finNote + "\n" + qualifiers;
            }
        }
        var qualArr = qualifiers.split("\n");
        for (var i = 0 ; i < qualArr.length - 1 ; i++) {
            content += "                     " + qualArr[i] + "\n";
        }
    }
    content += "ORIGIN      \n";
    for (var i = 0; i < seq.length ; i++) {
        if (i % 60 == 0) {
            if (i != 0) {
                content += "\n";
            }
            var pIco = i + 1;
            var iStr = pIco.toString();
            for (var j = iStr.length; j < 9 ; j++) {
                content += " ";
            }
            content += iStr + " ";
        } else {
            if (i % 10 == 0) {
                content += " ";
            }
        }
        content += seq.charAt(i);
    }
    content += "\n//\n\n";
    var fileName = "Feature_Library.gb";
    return wdeSaveFile(fileName, content, "text");
}

window.wdeSaveFasta = wdeSaveFasta;
function wdeSaveFasta() {
    var content = ">";
    content += document.getElementById('SEQUENCE_ID').value;
    content += "\n";
    var seq = wdeCleanSeq(window.frames['WDE_RTF'].document.body.innerHTML);
        for (var i = 0; i < seq.length ; i++) {
            if (i % 70 == 0) {
                if (i != 0) {
                    content += "\n";
                }
            }
            content += seq.charAt(i);
        }
    content += "\n";
    var fileName = document.getElementById('SEQUENCE_ID').value + ".fa";
    return wdeSaveFile(fileName, content, "text");
};

window.wdeSaveFile = wdeSaveFile;
function wdeSaveFile(fileName,content,type) {
    if (wdeInTestRun == 1) {
        return [fileName,content,type];
    }
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";
    var blob;
    if (type == "html") {
        blob = new Blob([content], {type: "text/html"});
    } else if (type == "svg") {
        blob = new Blob([content], {type: "image/svg+xml"});
    } else {
        blob = new Blob([content], {type: "text/plain"});
    }
    var browser = wdeDetectBorwser();
    if (browser != "edge") {
	    var url = window.URL.createObjectURL(blob);
	    a.href = url;
	    a.download = fileName;
	    a.click();
	    window.URL.revokeObjectURL(url);
    } else {
        window.navigator.msSaveBlob(blob, fileName);
    }
    return "";
};

window.wdeModifySelection = wdeModifySelection;
function wdeModifySelection(modifyFunction){
    var sel, range;
    if (window.frames['WDE_RTF'].getSelection) {
        sel = window.frames['WDE_RTF'].getSelection();
        var theSelection = sel.toString();
        var replacementText = modifyFunction(theSelection);
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode(window.frames['WDE_RTF'].document.createTextNode(replacementText));
        }
    } 
    wdeRepaint();
}

window.wdeUpToLow = wdeUpToLow;
function wdeUpToLow() {
    wdeModifySelection(wdeUpToLowModify);
}

window.wdeUpToLowModify = wdeUpToLowModify;
function wdeUpToLowModify(text) {
    return text.toLowerCase();
}

window.wdeLowToUp = wdeLowToUp;
function wdeLowToUp() {
    wdeModifySelection(wdeLowToUpModify);
}

window.wdeLowToUpModify = wdeLowToUpModify;
function wdeLowToUpModify(text) {
    return text.toUpperCase();
}

window.wdeUpexLow = wdeUpexLow;
function wdeUpexLow() {
    wdeModifySelection(wdeUpexLowModify);
}

window.wdeUpexLowModify = wdeUpexLowModify;
function wdeUpexLowModify(text) {
    var retText = "";
    for (var i = 0; i < text.length ; i++) {
        var letter = text.charAt(i);
        if (letter == letter.toUpperCase()) {
            retText += letter.toLowerCase();
        } else {
            retText += letter.toUpperCase();
        }
    }
    return retText;
}

window.wdeCopyPaste = wdeCopyPaste;
function wdeCopyPaste() {
    // WDE_RTF.document.execCommand('bold',false,null);
    // WDE_RTF.document.execCommand('copy');
    alert("Due to security policy the Wiley DNA Editor has limited clipboard access.\n\n" +
          "Only keyboard shortcuts are supported:\n\n" +
          "Cut: Ctrl+X or Cmd+X\n" +
          "Copy: Ctrl+C or Cmd+C\n" +
          "Paste: Ctrl+V or Cmd+V\n" +
          "Select All: Ctrl+A or Cmd+A\n\n" +
          "On some keyboards Ctrl is labled Strg\n\n" );
}

window.wdeRCompSel = wdeRCompSel;
function wdeRCompSel() {
    var sel, range;
    if (window.frames['WDE_RTF'].getSelection) {
        sel = window.frames['WDE_RTF'].getSelection();
        if (sel.rangeCount) {
            wdeSequenceModified();
            range = sel.getRangeAt(0);
            var theSelection = "X" + wdeReverseComplement(wdeCleanSeq(range.toString())) + "X";
            range.deleteContents();
            range.insertNode(window.frames['WDE_RTF'].document.createTextNode(theSelection));
	        var seqWSel = wdeCleanSeqWithMarks(window.frames['WDE_RTF'].document.body.innerHTML);
	        var loc = [];
	        var locCount = 0;
	        for (var i = 0; i < seqWSel.length ; i++) {
	            if (seqWSel.charAt(i) == "X") {
	                loc[loc.length] = locCount;
	            } else  {
	                locCount++;
	            } 
	        }
	        seqWSel = seqWSel.replace(/x/ig, "");
	        window.frames['WDE_RTF'].document.body.innerHTML = wdeFormatSeq(seqWSel, wdeZeroOne, wdeNumbers);
            // We have the split positions, now split the features they span
	        wdeFeatSplitAtLoc(loc[0]);
	        wdeFeatSplitAtLoc(loc[1]);
            // Now reverse the features between the locations
            wdeFeatModifyBetween((loc[0] + 1),loc[1],"R");
            // Sort the feature list
            wdeFeatures.sort(wdeFeatListSort);
	        wdeFeatFocRepaint();
        }
    }
}

window.wdeRComp = wdeRComp;
function wdeRComp(){
    wdeSequenceModified();
    var seq = wdeCleanSeq(window.frames['WDE_RTF'].document.body.innerHTML);
    window.frames['WDE_RTF'].document.body.innerHTML = wdeFormatSeq(wdeReverseComplement(seq), wdeZeroOne, wdeNumbers);
    // Flip the Features
    var lastPos = seq.length + 1;
    for (var k = 0; k < wdeFeatures.length; k++) {
        wdeFeatures[k][1] = wdeFeatRevCompLoc(wdeFeatures[k][1], lastPos, 0);
    }
    wdeFeatures.sort(wdeFeatListSort);
    wdeFeatFocRepaint();
}

window.wdeFeatModifyBetween = wdeFeatModifyBetween;
function wdeFeatModifyBetween(a,b,mod){
    for (var k = 0; k < wdeFeatures.length; k++) {
	    if (/^(\d+)\..*?(\d+)$\s*/.test(wdeFECleanPos(wdeFeatures[k][1]))) {
		    var firstA = RegExp.$1;
		    var lastA = RegExp.$2;
	    } else {
	        /^(\d+)\s*/.test(wdeFeatures[k][1]);
		    var firstA = RegExp.$1;
		    var lastA = RegExp.$1;
	    }
	    if ((firstA >= a) && (firstA <= b) && (lastA >= a) && (lastA <= b)) {
	        if (mod == "R") {
	            wdeFeatures[k][1] = wdeFeatRevCompLoc(wdeFeatures[k][1], (b + 1), (a - 1));
	        }
	        if (mod == "D") {
	            wdeFeatures[k][1] = "Delete";
	        }
	    }
    }
    if (mod == "D") {
        var i = 0;
	    for (var k = 0; k < wdeFeatures.length; k++) {
		    if (!(/Delete/.test(wdeFeatures[k][1]))) {
		        wdeFeatures[i] = wdeFeatures[k].slice(0);
		        i++;
		    }
	    }
        wdeFeatures = wdeFeatures.slice(0, i);
    }
}

window.wdeFeatShiftAfterLoc = wdeFeatShiftAfterLoc;
function wdeFeatShiftAfterLoc(split,shiftDiff){
    for (var k = 0; k < wdeFeatures.length; k++) {
        var retVal = "";
        var num = "";
        var numFound = 0;
        var changeLoc = 0;
        var loc = wdeFeatures[k][1];
	    for (var i = 0; i < loc.length ; i++) {
	        if (/\d/.test(loc.charAt(i))) {
	            num += loc.charAt(i);
	            numFound = 1;
	        } else {
	            if (numFound) {
	                 num = parseInt(num);
	                 if (num > split) {
	                     num = num + shiftDiff;
	                     changeLoc = 1;
	                 }
	                 retVal += "" + num;
	                 num = "";
	                 numFound = 0;
	            }
	            retVal += loc.charAt(i);
	        }
	    }
        if (numFound) {
             num = parseInt(num);
             if (num > split) {
                 num = num + shiftDiff;
                 changeLoc = 1;
             }
             retVal += "" + num;
             num = "";
             numFound = 0;
        }
        if (changeLoc) {
            wdeFeatures[k][1] = retVal;
        }
    }
    wdeFeatures.sort(wdeFeatListSort);
}

window.wdeFeatSplitAtLoc = wdeFeatSplitAtLoc;
function wdeFeatSplitAtLoc(split){
    for (var k = 0; k < wdeFeatures.length; k++) {
        var retValL = "";
        var retValR = "";
	    var isRev = 0;
        var loc = wdeFeatures[k][1];
	    if (/complement\((.+)\)\s*$/g.test(loc)) {
	        isRev = 1;
	        loc = RegExp.$1;
	    }
	    if (/join\((.+)\)\s*$/g.test(loc)) {
	        loc = RegExp.$1;
	    }
	    var singLoc = loc.split(",");
	    for (var i = 0; i < singLoc.length; i++) {
	        if (/:/g.test(singLoc[i])) {
	            continue;
	        }
	        if (/^(\D*)(\d+)([\^\.]+)(\D*)(\d+)$/g.test(singLoc[i])) {
	            var aSig = RegExp.$1;
	            var aVal = parseInt(RegExp.$2);
	            var sep  = RegExp.$3;
	            var bSig = RegExp.$4;
	            var bVal = parseInt(RegExp.$5);
	            if (bVal == 1) {
	                bVal = aVal + 1;
	            }
	            if ((aVal > split) && (bVal > split)) {
	                retValR += singLoc[i] + ",";
	            } else if ((aVal <= split) && (bVal <= split)) {
	                retValL += singLoc[i] + ",";
	            } else {
	                if (aVal < bVal) {
		                retValL += "" + aSig + aVal + sep + split + ",";
		                retValR += "" + (split + 1) + sep + bSig + bVal + ",";
	                } else {
	                    alert("Should not happen - unexpected location found!\n" + bVal + "<=" + aVal);
		                retValL += "" + bSig + bVal + sep + split + ",";
		                retValR += "" + (split + 1) + sep + aSig + aVal + ",";
	                }
	            } 
	        } else {
	            /^(\D*)(\d+).*/g.test(singLoc[i]);
	            var aSig = RegExp.$1;
	            var aVal = parseInt(RegExp.$2);
	            if (aVal > split) {
	                retValR += singLoc[i] + ",";
	            } else {
	                retValL += singLoc[i] + ",";	            
	            }
	        }
	    }  
        // Only if split happened do this
	    if ((retValL != "") && (retValR != "")) {
	        retValL = retValL.replace(/,$/, "");
	        retValR = retValR.replace(/,$/, "");
	        if (/,/g.test(retValL)) {
	            retValL = "join(" + retValL + ")";
	        }
	        if (/,/g.test(retValR)) {
	            retValR = "join(" + retValR + ")";
	        }
	        if (isRev == 1) {
	            retValL = "complement(" + retValL + ")";
	            retValR = "complement(" + retValR + ")";		        
	        }
	        wdeFeatures[k][1] = retValL;
	        var noteEdit = "";
			if (/\/note="([\s\S]+)"\s*$/g.test(wdeFeatures[k][7])) {
		        noteEdit = RegExp.$1;
		    }
	        noteEdit = noteEdit.replace(/partial\s*$/g, "");
	        noteEdit = noteEdit.replace(/\s*\-\s*$/g, "");
	        if (noteEdit != "") {
	            noteEdit += " - ";
	        }
	        wdeFeatures[k][7] = "/note=\"" + noteEdit + "partial\"";
	        var newArPos = wdeFeatures.length;
	        wdeFeatures[newArPos] = wdeFeatures[k].slice(0);
	        wdeFeatures[newArPos][1] = retValR;
	    }
    }
    wdeFeatures.sort(wdeFeatListSort);
}

window.wdeFeatRevCompLoc = wdeFeatRevCompLoc;
function wdeFeatRevCompLoc(loc,lastPos,offset){
    var retVal = "";
    var numA = "";
    var numB = "";
    var numAS = "";
    var numBS = "";
    var allEx = " ";
    var exFound = 0;
    var sep = "";
    var sepFound = 0;
    var isRev = 0;
    var isJoin = 0;
    if (/complement\((.+)\)\s*$/g.test(loc)) {
        isRev = 1;
        loc = RegExp.$1;
    }
    if (/join\((.+)\)\s*$/g.test(loc)) {
        isJoin = 1;
        loc = RegExp.$1;
    }
    for (var i = 0; i < loc.length ; i++) {
        if (loc.charAt(i) == "<") {
            if (sepFound) {
                numBS += ">";
            } else {
                numAS += ">";
            }
        } else if (loc.charAt(i) == ">") {
            if (sepFound) {
                numBS += "<";
            } else {
                numAS += "<";
            }
        } else if (loc.charAt(i) == ":") {
            exFound = 1;
        } else if ((/\d/.test(loc.charAt(i))) && (i == loc.length - 1)) {
            if (sepFound) {
                numB += loc.charAt(i);
            } else {
                numA += loc.charAt(i);
            }
            if (exFound == 1) {
                retVal += "" + allEx.substring(1) + loc.charAt(i);;
            } else {
	            if (parseInt(numA) > 0) {
	                numA = lastPos - parseInt(numA) + offset;
	            }
	            if (parseInt(numB) > 0) {
	                numB = lastPos - parseInt(numB) + offset;
	            }
	            retVal += "" + numBS + numB + sep + numAS + numA;
            }
        } else if (/\d/.test(loc.charAt(i))) {
            if (sepFound) {
                numB += loc.charAt(i);
            } else {
                numA += loc.charAt(i);
            }
        } else if ((loc.charAt(i) == ".") || (loc.charAt(i) == "^")) {
            sep += loc.charAt(i);
            sepFound = 1;
        } else if ((loc.charAt(i) == ",") || (loc.charAt(i) == ")")) {
            if (exFound == 1) {
                retVal += "" + allEx.substring(1) + loc.charAt(i);
                exFound = 0;
            } else {
	            if (parseInt(numA) > 0) {
	                numA = lastPos - parseInt(numA) + offset;
	            }
	            if (parseInt(numB) > 0) {
	                numB = lastPos - parseInt(numB) + offset;
	            }
	            retVal += "" + numBS + numB + sep + numAS + numA + loc.charAt(i);
            }
            numA = "";
            numB = "";
            numAS = "";
            numBS = "";
            allEx = "";
            sep = "";
            sepFound = 0;
        } else {
    //      retVal += loc.charAt(i);
        }
        allEx += loc.charAt(i);
    }
    if (isJoin) {
        var locOrder = retVal.split(",");
        retVal = "join(";
        for (var i = locOrder.length - 1 ; i >= 0 ; i--) {
            retVal += locOrder[i] + ",";
        }
        retVal = retVal.replace(/,$/, ")");
    }
    if (isRev != 1) {
        retVal = "complement(" + retVal + ")";
    }    
    return retVal;
}

window.wdeSequenceModified = wdeSequenceModified;
function wdeSequenceModified(){
    // This function erases found RS and user seq info
    // to be used if the sequence is modified 
    for (var k = 0; k < wdeEnzy.length; k++) {
        wdeEnzy[k][3] = "-";
        wdeEnzy[k][4] = "";
        wdeEnzy[k][6] = "";
    }
    wdeUser[3] = "-";
    document.getElementById("WDE_USER_COUNT").innerHTML = "Hits: -";
    wdeUser[4] = "";
    wdeUser[6] = "";
    wdeSeqHigh = [];
    wdeREdisp = 0;
    wdeSeqFeat = [];
    wdeFEdisp = 0;
    var lButton = document.getElementById("wdeFeatButton");
    lButton.value = "Show Features";
    wdeDrawEnzymes();
}

window.wdeHighlight = wdeHighlight;
function wdeHighlight(){
    // Set Highlights to nothing
    wdeDigSeqNote = {};
    var seq = wdeCleanSeq(window.frames['WDE_RTF'].document.body.innerHTML);
    var end = seq.length;
    for (var j = 0; j < end ; j++) {
        wdeSeqHigh[j] = ".";
    }
    if (wdeREdisp) {
        wdeREdisp = 0;
    } else {
        var sel = 0;
        // Place user defined Sequence
        if (wdeUser[2] && !(wdeUser[3] == "-") && (wdeUser[3] > 0)) {
            sel++;
            var listArr = wdeUser[4].split(";");
            for (var i = 1; i < listArr.length; i++) {
                var posAr = listArr[i].split(",");
                for (var p = 0; p < parseInt(posAr[1]); p++) {
                    var curr = parseInt(posAr[0]) - wdeZeroOne + p;
                    if (curr < end) {
                        wdeSeqHigh[curr] = "R";
                        wdeAddDigSeqNote(curr, wdeUser[0] + " - " + wdeUser[1]);		  
                    }
                }
            }
        }
        // Place the Masking
        for (var k = 0; k < wdeEnzy.length; k++) {
            if (wdeEnzy[k][2] && !(wdeEnzy[k][3] == "-") && (wdeEnzy[k][3] > 0)){
                sel++;
                var listArr = wdeEnzy[k][4].split(";");
                for (var i = 1; i < listArr.length; i++) {
                    var posAr = listArr[i].split(",");
                    for (var p = 0; p < parseInt(posAr[1]); p++) {
                        var curr = parseInt(posAr[0]) - wdeZeroOne + p;
                        if (curr < end) {
                            wdeSeqHigh[curr] = "R";
                            wdeAddDigSeqNote(curr, wdeEnzy[k][0] + " - " + wdeEnzy[k][1]);
                        }
                    }
                }
            }
        }
        if (sel > 0) {
            wdeREdisp = 1;
            browseTabFunctionality('WDE_main_tab');
        } else {
            browseTabFunctionality('WDE_restriction_sites');
            alert("No restriction enzymes selected!\n\nSelect at least one restriction enzyme.");
        }
    }
    wdeRepaint();
}

function wdeAddDigSeqNote(pos, seq) {
    if (wdeDigSeqNote.hasOwnProperty(pos)) {
        if (wdeDigSeqNote[pos] != seq) {
            wdeDigSeqNote[pos] = wdeDigSeqNote[pos] + "; " + seq;
        }
    } else {
        wdeDigSeqNote[pos] = seq;
    }
}

window.wdeFormatSeq = wdeFormatSeq;
function wdeFormatSeq(seq, wdeZeroOne, wdeNumbers){
    var outSeq = "\n";
    var length = seq.length;
    var digits = 0;
    var lastBaseMark = ".";
    var lastRsAnnotation = "";
    var openMark = "";
    var closeMark = "";
    var openFeat = "";
    var closeFeat = "";
    wdeFeatInfo = [];
    for (var i = length; i > 1 ; i = i / 10) {
        digits++;
    }
    digits++;
    document.getElementById('SEQUENCE_LENGTH').value = length;

    for (var i = 0; i < seq.length ; i++) {
        if (i % 80 == 0) {
            if (i != 0) {
                outSeq += closeMark + closeFeat + "\n";
            }
            if (wdeNumbers != 0) {
                var pIco = i + wdeZeroOne;
                var iStr = pIco.toString();
                for (var j = digits; j > iStr.length ; j--) {
                    outSeq += " ";
                }
                outSeq += iStr + "  ";
            }
            if (openMark == "") {
                outSeq += openFeat;
            }
            outSeq += openMark;
         } else {
            if ((i % 10 == 0) && (wdeNumbers != 0)) {
                outSeq += " ";
            }
        }
        // Place the features
        if ((wdeFEdisp != 0) && (length == wdeSeqFeat.length - 2) && (wdeSeqFeat[i] == "R")) {
            var featColor = wdeFeatureColor(i);
            if (featColor[0] != "D") {
                var infoCount = wdeFeatInfo.length;
                wdeFeatInfo[infoCount] = [featColor[1],featColor[2]] ;
                outSeq += closeFeat;
                openFeat = '<a onclick="parent.wdeFeatInfoUpdate(' + infoCount + ')" style="background-color:' + featColor[0] + '">';
                if (openMark == "") {		    
                    outSeq += openFeat;
                    closeFeat = "</a>";
                }
            } else {
                outSeq += closeFeat;
                openFeat = "";
                closeFeat = "";
            }
        }
        // Place the enzyme selection
        if ((wdeREdisp != 0) && (length == wdeSeqHigh.length) && ((wdeSeqHigh[i] != lastBaseMark) || ((wdeSeqHigh[i] == "R") && (lastRsAnnotation != wdeDigSeqNote[i])))) {
            if (wdeSeqHigh[i] == "R") {
                var infoCount2 = wdeFeatInfo.length;
                wdeFeatInfo[infoCount2] = [wdeDigSeqNote[i], -2] ;
                outSeq += closeFeat;
                outSeq += closeMark; // in case the Feature Update has to change		    
                openMark = '<a onclick="parent.wdeFeatInfoUpdate(' + infoCount2 + ')" style="background-color:#FF0000">';//'<span style="background-color:red">';
                closeMark = "</a>";
                outSeq += openMark;
                lastRsAnnotation =  wdeDigSeqNote[i];
            }
            if (wdeSeqHigh[i] == ".") {
                outSeq += closeMark;
                openMark = "";
                closeMark = "";
                if (openFeat != "") {
                    outSeq += openFeat;
                    closeFeat = "</a>";
                }		    
            }
            lastBaseMark = wdeSeqHigh[i];
        }
        outSeq += seq.charAt(i);
    }
    return '<pre id="wdeStartNode"> ' + outSeq + " </pre>";
}

window.wdeCleanSeq = wdeCleanSeq;
function wdeCleanSeq(seq){
    var retSeq = wdeCleanSeqWithMarks(seq);
    retSeq = retSeq.replace(/x/ig, "");
    return retSeq;
}

window.wdeCleanSeqWithMarks = wdeCleanSeqWithMarks;
function wdeCleanSeqWithMarks(seq){
    var retSeq = "";
    // Remove all HTML tags
    seq = seq.replace(/<span style="background-color: *[^" ]+">/ig, " ");
    seq = seq.replace(/<\/span>/g, " ");
    seq = seq.replace(/<pre[^>]*>/g, " ");
    seq = seq.replace(/<\/pre>/g, " ");
    seq = seq.replace(/<a [^>]+>/ig, " ");
    seq = seq.replace(/<\/a>/g, " ");
    seq = seq.replace(/<br[ \/]*>/g, " ");

    retSeq = wdeRetAmbiqutyOnly(seq);
    return retSeq;
}

window.wdeSelFeatSelMod  = wdeSelFeatSelMod ;
function wdeSelFeatSelMod (sel) {
    for (var k = 0; k < wdeFeatures.length; k++) {
        if (sel == -1) {
	        if (wdeFeatures[k][9] == 1) {
	            wdeFeatures[k][9] = 0;
	        } else {
	            wdeFeatures[k][9] = 1;
	        }
        } else {
	        if (sel == 0) {
	            wdeFeatures[k][9] = 0;
	        }
	        if (sel == 1) {
	            wdeFeatures[k][9] = 1;
	        }
        }
    }
    wdeFeatFocRepaint();
}

window.wdeShowFeatures = wdeShowFeatures;
function wdeShowFeatures(){
    // Set Marks to nothing
    var lButton = document.getElementById("wdeFeatButton");
    var seq = wdeCleanSeq(window.frames['WDE_RTF'].document.body.innerHTML);
    var end = seq.length + 2;
    wdeSeqFeat = [];
    for (var j = 0; j < end ; j++) {
        wdeSeqFeat[j] = ".";
    }
    if (wdeFEdisp) {
        wdeFEdisp = 0;
        wdeFeatInfo = [];
        lButton.value = "Show Features";
    } else {
        var sel = 0;
        // Place the Marks
        for (var k = 0; k < wdeFeatures.length; k++) {
	        if (wdeFeatures[k][9] == 0) {
	            continue;
	        }
	        var posListString = wdeFECleanPos(wdeFeatures[k][1]);
	        if (posListString.length <= 0) {
	            continue;
	        }
	        var posList = posListString.split(",");
            for (var i = 0; i < posList.length; i++) {
                var singPos = posList[i].split(".");
                if (parseInt(singPos[0]) > seq.length) {
                    singPos[0] = seq.length;
                }
                if (parseInt(singPos[0]) > 0) {
                    wdeSeqFeat[(parseInt(singPos[0]) - 1)] = "R";
                    sel++;
                }
                if (singPos.length == 1) {
	                wdeSeqFeat[parseInt(singPos[0])] = "R";
                }
                if (singPos.length == 2) {
	                if (parseInt(singPos[1]) > seq.length) {
	                    singPos[1] = seq.length;
	                }
	                if (parseInt(singPos[1]) > 1) {
	                    wdeSeqFeat[parseInt(singPos[1])] = "R";
	                }
	                if (parseInt(singPos[1]) == 1) {
	                    wdeSeqFeat[(parseInt(singPos[0]) + 1)] = "R";
	                }
                }
            }
        }
        if (sel > 0) {
            wdeFEdisp = 1;
            lButton.value = "Hide Features";
            browseTabFunctionality('WDE_main_tab');
        } else {
  //        browseTabFunctionality('WDE_restriction_sites');
            alert("No features to display!\n\nCreate at least one feature.");
        }
    }
    wdeRepaint();
}

window.wdeHideFeatures = wdeHideFeatures;
function wdeHideFeatures(){
    // Set Marks to nothing
    var lButton = document.getElementById("wdeFeatButton");
    wdeFEdisp = 0;
    wdeFeatInfo = [];
    lButton.value = "Show Features";
    wdeRepaint();
}

window.wdeFECleanPos = wdeFECleanPos;
function wdeFECleanPos(loc) {
    var posList = loc.replace(/[^,:]+:[^,]+/g, "");
    posList = posList.replace(/\^/g, ".");
    posList = posList.replace(/\.+/g, ".");
    posList = posList.replace(/[^0-9,.]/g, "");
    posList = posList.replace(/,+/g, ",");
    posList = posList.replace(/^,/g, "");
    posList = posList.replace(/,$/g, "");
    return posList;
}

window.wdeFeatureColor = wdeFeatureColor;
function wdeFeatureColor(pos){
    var selFeat = [];
    // [][0]  number of feature hit
    // [][1]  length of feature
    var selCount = 0;
    var inFeat = 0;
    var start = 0;
    var end = 0;
    for (var k = 0; k < wdeFeatures.length; k++) {
        if (wdeFeatures[k][9] == 0) {
            continue;
        }
        var posListString = wdeFECleanPos(wdeFeatures[k][1]);
        if (posListString.length <= 0) {
            continue;
        }
        var posList = posListString.split(",");
        for (var i = 0; i < posList.length; i++) {
            var singPos = posList[i].split(".");
            if (parseInt(singPos[0]) > 0) {
                start = parseInt(singPos[0]) - 1;
            }
            if (singPos.length == 1) {
                end = parseInt(singPos[0]) - 1;
            }
            if (singPos.length == 2) {
                if (parseInt(singPos[1]) > 0) {
                    end = parseInt(singPos[1]) - 1;
                }
                if (parseInt(singPos[1]) == 1) {
                    end = parseInt(singPos[0]);
                }
            }
            // Do not color full length features
            if ((start <= pos) && (pos <= end) &&
                 !((start == 0) && (end == wdeSeqFeat.length - 3))) {
                var cLen = end - start;
                selFeat[selCount] = [k,cLen,wdeFeatures[k][0]];
                inFeat = 1;
                selCount++;
            }
        }
    }
    if (inFeat == 1) {
        selFeat.sort(wdeFeatSortSize);
        var calCol = wdeFinFeatureColor(wdeFeatures, selFeat[0][0]);
        if (wdeVFeatTransp) {
            var rgbSum = [255,255,255];
            var toAdd = wdeColorHexToRgb(calCol[0]);
            rgbSum = wdeColorAddColor(rgbSum, toAdd, 0);
            var end = selFeat.length;
            if (end > 4) {
                end = 4;
            }
            for (var i = 1; i < end; i++) {
                var addCol = wdeFinFeatureColor(wdeFeatures, selFeat[i][0]);
                toAdd = wdeColorHexToRgb(addCol[0]);
                rgbSum = wdeColorAddColor(rgbSum, toAdd, i);
            }
            calCol[0] = wdeColorRgbToHex(rgbSum[0],rgbSum[1],rgbSum[2]);
        }
        return calCol;
    } else {
        return ["D","",-1];
    }
}

window.wdeColorAddColor = wdeColorAddColor;
function wdeColorAddColor(base, add, step) {
    var div = step + 1;
    var r = Math.floor(base[0] * (3 * div - 1) / (3 * div) + add[0] * 1 / (3 * div));
    var g = Math.floor(base[1] * (3 * div - 1) / (3 * div) + add[1] * 1 / (3 * div));
    var b = Math.floor(base[2] * (3 * div - 1) / (3 * div) + add[2] * 1 / (3 * div));
    return [r,g,b];
}

window.wdeColorHexToRgb = wdeColorHexToRgb;
function wdeColorHexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    var ret = [];
    if (result) {
        ret[0] = parseInt(result[1], 16);
        ret[1] = parseInt(result[2], 16);
        ret[2] = parseInt(result[3], 16);
        return ret;
    } else {
        return [0,0,0];
    }
}

window.wdeColorRgbToHex = wdeColorRgbToHex;
function wdeColorRgbToHex(r, g, b) {
    return "#" + wdeColorSingRgbToHex(r) + wdeColorSingRgbToHex(g) + wdeColorSingRgbToHex(b);
}

window.wdeColorSingRgbToHex = wdeColorSingRgbToHex;
function wdeColorSingRgbToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

window.wdeFeatSortSize = wdeFeatSortSize;
function wdeFeatSortSize(a, b) {
    if (a[1] != b[1]) {
        return a[1] - b[1];
    } else {
        var aa = wdeFeatTypeToInt(a[2]);
        var bb = wdeFeatTypeToInt(b[2]);
        return aa - bb;
    }
}

window.wdeFeatTypeToInt = wdeFeatTypeToInt;
function wdeFeatTypeToInt(featType) {
    for (var k = 0; k < wdeFeatColor.length; k++) {
        if (wdeFeatColor[k][0] == featType) {
            return k;
        }
    }
    return wdeFeatColor.length;
}

window.wdeFinFeatureColor = wdeFinFeatureColor;
function wdeFinFeatureColor(arr, feat){
    var featName = ": " + arr[feat][2];
    if (/complement/.test(arr[feat][1])) {
        // Reverse Section
        if (arr[feat][5] == "D") {
            var retVal = wdeFinFeatColSeg(arr[feat]);
            return [retVal[2], retVal[0] + featName + " (Reverse)", feat];
        } else {
            return ["#" + arr[feat][5], arr[feat][0] + featName + " (Reverse)", feat];
        }
    } else {
        // Forward Section
        if (arr[feat][4] == "D") {
            var retVal = wdeFinFeatColSeg(arr[feat]);
            return [retVal[1], retVal[0] + featName + " (Forward)", feat];
        } else {
            return ["#" + arr[feat][4], arr[feat][0] + featName + " (Forward)", feat];
        }
    }
    return ["#FF0000","No matching feature type found!", -1];
}

window.wdeFinFeatColSeg = wdeFinFeatColSeg;
function wdeFinFeatColSeg(feat){
    if (feat[0] == "regulatory") {
        if (/\/regulatory_class="([^"]+)"/g.test(feat[8])) {
	        var regClass = RegExp.$1;
		    for (var k = 0; k < wdeFeatRegColor.length; k++) {
		        if (wdeFeatRegColor[k][0] == regClass) {
		            return [wdeFeatRegColor[k][0], wdeFeatRegColor[k][1], wdeFeatRegColor[k][2]];
		        }
			}
        }
    }
    for (var k = 0; k < wdeFeatColor.length; k++) {
        if (wdeFeatColor[k][0] == feat[0]) {
            return [wdeFeatColor[k][0], wdeFeatColor[k][1], wdeFeatColor[k][2]];
        }
    }
    return ["No matching feature type found!", "#FF0000", "#FF0000"];
}

window.wdeFeatInfoUpdate = wdeFeatInfoUpdate;
function wdeFeatInfoUpdate(infoCount) {
    if (infoCount < 0) {
        document.getElementById('wdeInfoField').value = "";
    } else {
        document.getElementById('wdeInfoField').value = wdeFeatInfo[infoCount][0];
        if (wdeFeatInfo[infoCount][1] != -2) { // -2 is restriction site		
            wdeFeatFocUpdate(wdeFeatInfo[infoCount][1]);
        }
    }
}

window.wdeFeatFocUpdate = wdeFeatFocUpdate;
function wdeFeatFocUpdate(feat) {
    if ((feat > -1) && (feat < wdeFeatures.length)) {
        wdeFeatSelFeat = wdeFeatures[feat].slice(0);
        wdeFeatSelNum = feat;
    } else {
        wdeFeatSelFeat = ["gene","","Enter Feature Name","U","D","D","arrow","","",1,""];
        wdeFeatSelNum = -1;
    }
    wdeFeatFocRepaint();
}

window.wdeLibFocUpdate = wdeLibFocUpdate;
function wdeLibFocUpdate(feat) {
    if ((feat > -1) && (feat < wdeFeatureLib.length)) {
        wdeLibSelFeat = wdeFeatureLib[feat].slice(0);
        wdeLibSelNum = feat;
    } else {
        wdeLibSelFeat = ["gene","","Enter Feature Name","U","D","D","arrow","","",1,""];
        wdeLibSelNum = -1;
    }
    wdeLibFocRepaint();
}

window.wdeFeatFocRepaint = wdeFeatFocRepaint;
function wdeFeatFocRepaint() {
    var content = '<table border="0">';
    content += "<tr>";
    content += '<th style="text-align: left">Show&nbsp;&nbsp;</th>';
    content += '<th style="text-align: left">Type';
    content += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>';
    content += '<th style="text-align: left">Tag';
    content += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    content += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>';
    content += '<th style="text-align: left">Orientation&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>';
	content += '<th style="text-align: left">Location</th>';
    content += "</tr>\n";
    for (var k = 0; k < wdeFeatures.length; k++) {
        var checkBoxStr = '<input type="checkbox" id="WDE_FEA_' + k;
        checkBoxStr += '" onclick="parent.wdeSelFeatures(this, ' + k + ')"';
        if (wdeFeatures[k][9] != 0) {
            checkBoxStr += ' checked=""';
        }
        checkBoxStr += '>';
        var funCl = ' onclick="parent.wdeFeatFocUpdate(' + k + ')"';
	    content += '<tr>\n';
	    var colAr = wdeFinFeatColSeg(wdeFeatures[k]);
	    var colFin = wdeFinFeatureColor(wdeFeatures, k);
	    var dispPos = wdeParseFeatPos(wdeFeatures[k][1]);
	    if (/complement/.test(wdeFeatures[k][1])) {
	        content += '<td style="text-align: center; background-color:' + colAr[2]  + '"'  + '>' + checkBoxStr + "</td>";
	        content += '<td style="background-color:' + colAr[2]  + '"' + funCl + '>' + wdeFeatures[k][0] + "</td>";
	        content += '<td style="background-color:' + colFin[0] + '"' + funCl + '>' + wdeFeatures[k][2] + "</td>";
	        content += '<td style="background-color:' + colFin[0] + '"' + funCl + '>Reverse</td>';
                content += '<td style="background-color:' + colFin[0] + '"' + funCl + '>' + dispPos + "</td>";
	    } else {
	        content += '<td style="text-align: center; background-color:' + colAr[1]  + '"'  + '>' + checkBoxStr + "</td>";
	        content += '<td style="background-color:' + colAr[1]  + '"' + funCl + '>' + wdeFeatures[k][0] + "</td>";
	        content += '<td style="background-color:' + colFin[0] + '"' + funCl + '>' + wdeFeatures[k][2] + "</td>";
	        content += '<td style="background-color:' + colFin[0] + '"' + funCl + '>Forward</td>';
	        content += '<td style="background-color:' + colFin[0] + '"' + funCl + '>' + dispPos + "</td>";
	    }
	    content += "</tr>\n";
    }
    content += '</table>';
    window.frames['WDE_FEAT_L'].document.body.innerHTML = content;

    var select = document.getElementById('WDE_FEAT_TYPE');
    for(var i = select.options.length - 1 ; i >= 0 ; i--) {
        select.remove(i);
    }
    for (var k = 0; k < wdeFeatColor.length; k++) {
        var option = document.createElement( 'option' );
        option.value = k;
        option.text = wdeFeatColor[k][0];
        if (wdeFeatColor[k][0] == wdeFeatSelFeat[0]) {
           option.setAttribute('selected', true);
        }    
        select.add(option);
    }
	select = document.getElementById('WDE_FEAT_REG_TYPE');
    if (wdeFeatSelFeat[0] == "regulatory") {
        var regClass = "promoter";
        if (/\/regulatory_class="([^"]+)"/g.test(wdeFeatSelFeat[8])) {
	        regClass = RegExp.$1;
	    }
	    for(var i = select.options.length - 1 ; i >= 0 ; i--) {
	        select.remove(i);
	    }
	    for (var k = 0; k < wdeFeatRegColor.length; k++) {
	        var option = document.createElement( 'option' );
	        option.value = k;
	        option.text = wdeFeatRegColor[k][0];
	        if (wdeFeatRegColor[k][0] == regClass) {
	           option.setAttribute('selected', true);
	        }    
	        select.add(option);
		}
    } else {
	    for(var i = select.options.length - 1 ; i >= 0 ; i--) {
	        select.remove(i);
	    }
        var option = document.createElement( 'option' );
        option.value = 0;
        option.text = "Only available with regulatory features";
        select.add(option);
    }
    document.getElementById('WDE_FEAT_TAG').value = wdeFeatSelFeat[2];
    document.getElementById('WDE_FEAT_LOC').value = wdeFeatSelFeat[1];
    if(/complement\(.*\)\s*$/.test(wdeFeatSelFeat[1])) {
        wdeSetFFeatSetRev(0);
    } else {
        wdeSetFFeatSetRev(1);
    }
    if (wdeFeatSelFeat[4] == "D") {
        var col = "#000000";
	    if ((wdeFeatSelFeat[0] == "regulatory") && (/\/regulatory_class="([^"]+)"/g.test(wdeFeatSelFeat[8]))) {
	        var regClass = RegExp.$1;
		    for (var k = 0; k < wdeFeatRegColor.length; k++) {
		        if (wdeFeatRegColor[k][0] == regClass) {
		            col = wdeFeatRegColor[k][1];
		        }
			}
	    } else {
		    for (var k = 0; k < wdeFeatColor.length; k++) {
		        if (wdeFeatColor[k][0] == wdeFeatSelFeat[0]) {
		            col = wdeFeatColor[k][1];
		        }
			}
		}
        document.getElementById('WDE_FEAT_FCOL').value = col;
    } else {
        document.getElementById('WDE_FEAT_FCOL').value = "#" + wdeFeatSelFeat[4];
    }
    if (wdeFeatSelFeat[5] == "D") {
        var col = "#000000";
	    if ((wdeFeatSelFeat[0] == "regulatory") && (/\/regulatory_class="([^"]+)"/g.test(wdeFeatSelFeat[8]))) {
	        var regClass = RegExp.$1;
		    for (var k = 0; k < wdeFeatRegColor.length; k++) {
		        if (wdeFeatRegColor[k][0] == regClass) {
		            col = wdeFeatRegColor[k][2];
		        }
			}
	    } else {
		    for (var k = 0; k < wdeFeatColor.length; k++) {
		        if (wdeFeatColor[k][0] == wdeFeatSelFeat[0]) {
		            col = wdeFeatColor[k][2];
		        }
			}
		}
        document.getElementById('WDE_FEAT_RCOL').value = col;
    } else {
        document.getElementById('WDE_FEAT_RCOL').value = "#" + wdeFeatSelFeat[5];
    }
    select = document.getElementById('WDE_FEAT_SHAPE');
    for(var i = select.options.length - 1 ; i >= 0 ; i--) {
        select.remove(i);
    }
    for (var k = 0; k < 3; k++) {
        var option = document.createElement( 'option' );
        option.value = k;
        if (k == 0) {
	        option.text = "Default";
	        if (wdeFeatSelFeat[6] == "D") {
	           option.setAttribute('selected', true);
	        }
        }
        if (k == 1) {
	        option.text = "Box";
	        if (wdeFeatSelFeat[6] == "box") {
	           option.setAttribute('selected', true);
	        }
        }
        if (k == 2) {
	        option.text = "Arrow";
	        if (wdeFeatSelFeat[6] == "arrow") {
	           option.setAttribute('selected', true);
	        }
        }
        select.add(option);
	}
    if (/\/note="([\s\S]+)"\s*$/g.test(wdeFeatSelFeat[7])) {
        document.getElementById('WDE_FEAT_NOTE').value = RegExp.$1;
    } else if (/\/note="\s*"\s*$/g.test(wdeFeatSelFeat[7])) {
        document.getElementById('WDE_FEAT_NOTE').value = "";
    } else {
        document.getElementById('WDE_FEAT_NOTE').value = wdeFeatSelFeat[7];
    }
    document.getElementById('WDE_FEAT_QUALIF').value = wdeFeatSelFeat[8];
}

function wdeParseFeatPos(str) {
    if (wdeZeroOne == 1) {
        return str;
    }
    var numb = 0;
    var inNumb = 0;
    var ret = "";
    for (var i = 0; i < str.length ; i++) {
        var c = parseInt(str.charAt(i), 10);
        if (isNaN(c)) {
            if (inNumb != 0) {
                ret += (numb - 1);
                numb = 0;		  
                inNumb = 0;
	    }
            ret += str.charAt(i);
        } else {
            numb = 10 * numb + c;
            inNumb = 1;
	}
    }
    if (inNumb != 0) {
        ret += (numb - 1);
    }
    return ret;
}

window.wdeLibFocRepaint = wdeLibFocRepaint;
function wdeLibFocRepaint() {
    var content = '<table border="0">';
    content += "<tr>";
    content += '<th style="text-align: left">Tag';
    content += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>';
     content += '<th style="text-align: left">Size';
    content += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>';
    content += '<th style="text-align: left">Type';
    content += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</tr>\n";
    for (var k = 0; k < wdeFeatureLib.length; k++) {
        var funCl = ' onclick="parent.wdeLibFocUpdate(' + k + ')"';
	    content += '<tr>\n';
	    var colFin = wdeFinFeatureColor(wdeFeatureLib, k);
	    var basePairs = wdeCleanSeq(wdeFeatureLib[k][10]);
	    var colAr = wdeFinFeatColSeg(wdeFeatureLib[k]);
	    content += '<td style="background-color:' + colFin[0] + '"' + funCl + '>' + wdeFeatureLib[k][2] + "</td>";
	    content += '<td style="background-color:' + colFin[0] + '"' + funCl + '>' + basePairs.length + " bp</td>";
	    content += '<td style="background-color:' + colAr[1]  + '"' + funCl + '>' + wdeFeatureLib[k][0] + "</td>";
	    content += "</tr>\n";
    }
    content += '</table>';
    window.frames['WDE_LIB_L'].document.body.innerHTML = content;

    var select = document.getElementById('WDE_LIB_TYPE');
    for(var i = select.options.length - 1 ; i >= 0 ; i--) {
        select.remove(i);
    }
    for (var k = 0; k < wdeFeatColor.length; k++) {
        var option = document.createElement( 'option' );
        option.value = k;
        option.text = wdeFeatColor[k][0];
        if (wdeFeatColor[k][0] == wdeLibSelFeat[0]) {
           option.setAttribute('selected', true);
        }    
        select.add(option);
    }
	select = document.getElementById('WDE_LIB_REG_TYPE');
    if (wdeLibSelFeat[0] == "regulatory") {
        var regClass = "promoter";
        if (/\/regulatory_class="([^"]+)"/g.test(wdeLibSelFeat[8])) {
	        regClass = RegExp.$1;
	    }
	    for(var i = select.options.length - 1 ; i >= 0 ; i--) {
	        select.remove(i);
	    }
	    for (var k = 0; k < wdeFeatRegColor.length; k++) {
	        var option = document.createElement( 'option' );
	        option.value = k;
	        option.text = wdeFeatRegColor[k][0];
	        if (wdeFeatRegColor[k][0] == regClass) {
	           option.setAttribute('selected', true);
	        }    
	        select.add(option);
		}
    } else {
	    for(var i = select.options.length - 1 ; i >= 0 ; i--) {
	        select.remove(i);
	    }
        var option = document.createElement( 'option' );
        option.value = 0;
        option.text = "Only available with regulatory features";
        select.add(option);
    }
    document.getElementById('WDE_LIB_TAG').value = wdeLibSelFeat[2];
    document.getElementById('WDE_LIB_LOC').value = wdeLibSelFeat[1];
    if (wdeLibSelFeat[4] == "D") {
        var col = "#000000";
	    if ((wdeLibSelFeat[0] == "regulatory") && (/\/regulatory_class="([^"]+)"/g.test(wdeLibSelFeat[8]))) {
	        var regClass = RegExp.$1;
		    for (var k = 0; k < wdeFeatRegColor.length; k++) {
		        if (wdeFeatRegColor[k][0] == regClass) {
		            col = wdeFeatRegColor[k][1];
		        }
			}
	    } else {
		    for (var k = 0; k < wdeFeatColor.length; k++) {
		        if (wdeFeatColor[k][0] == wdeLibSelFeat[0]) {
		            col = wdeFeatColor[k][1];
		        }
			}
		}
        document.getElementById('WDE_LIB_FCOL').value = col;
    } else {
        document.getElementById('WDE_LIB_FCOL').value = "#" + wdeLibSelFeat[4];
    }
    if (wdeLibSelFeat[5] == "D") {
        var col = "#000000";
	    if ((wdeLibSelFeat[0] == "regulatory") && (/\/regulatory_class="([^"]+)"/g.test(wdeLibSelFeat[8]))) {
	        var regClass = RegExp.$1;
		    for (var k = 0; k < wdeFeatRegColor.length; k++) {
		        if (wdeFeatRegColor[k][0] == regClass) {
		            col = wdeFeatRegColor[k][2];
		        }
			}
	    } else {
		    for (var k = 0; k < wdeFeatColor.length; k++) {
		        if (wdeFeatColor[k][0] == wdeLibSelFeat[0]) {
		            col = wdeFeatColor[k][2];
		        }
			}
		}
        document.getElementById('WDE_LIB_RCOL').value = col;
    } else {
        document.getElementById('WDE_LIB_RCOL').value = "#" + wdeLibSelFeat[5];
    }
    select = document.getElementById('WDE_LIB_SHAPE');
    for(var i = select.options.length - 1 ; i >= 0 ; i--) {
        select.remove(i);
    }
    for (var k = 0; k < 3; k++) {
        var option = document.createElement( 'option' );
        option.value = k;
        if (k == 0) {
	        option.text = "Default";
	        if (wdeLibSelFeat[6] == "D") {
	           option.setAttribute('selected', true);
	        }
        }
        if (k == 1) {
	        option.text = "Box";
	        if (wdeLibSelFeat[6] == "box") {
	           option.setAttribute('selected', true);
	        }
        }
        if (k == 2) {
	        option.text = "Arrow";
	        if (wdeLibSelFeat[6] == "arrow") {
	           option.setAttribute('selected', true);
	        }
        }
        select.add(option);
	}
    document.getElementById('WDE_LIB_SEQ').value = wdeLibSelFeat[10];
    if (/\/note="([\s\S]+)"\s*$/g.test(wdeLibSelFeat[7])) {
        document.getElementById('WDE_LIB_NOTE').value = RegExp.$1;
    } else if (/\/note="\s*"\s*$/g.test(wdeLibSelFeat[7])) {
        document.getElementById('WDE_LIB_NOTE').value = "";
    } else {
        document.getElementById('WDE_LIB_NOTE').value = wdeLibSelFeat[7];
    }
    document.getElementById('WDE_LIB_QUALIF').value = wdeLibSelFeat[8];
}

window.wdeAnnotateSequence = wdeAnnotateSequence;
function wdeAnnotateSequence() {
    var seq = wdeCleanSeq(window.frames['WDE_RTF'].document.body.innerHTML);
    for (var k = 0; k < wdeFeatureLib.length; k++) {
        var testSeq = wdeCleanSeq(wdeFeatureLib[k][10]);
        // Forward
        var posArr = wdeFindTestInSeq(seq, testSeq);
        if (posArr[0] != -1) {
            for (var i = 0; i < posArr.length; i++) {
	            var tempArr = wdeLibShiftByFirst(wdeFeatureLib[k][1],posArr[i]);
	            wdeAnnoAddFeature(wdeFeatureLib[k], tempArr[0]);
	        }
        }
        // Reverse
        testSeq = wdeReverseComplement(testSeq);
        var posArr = wdeFindTestInSeq(seq, testSeq);
        if (posArr[0] != -1) {
            for (var i = 0; i < posArr.length; i++) {
                var locInverse = wdeFeatRevCompLoc(wdeFeatureLib[k][1], (testSeq.length + 1), posArr[i])
	            wdeAnnoAddFeature(wdeFeatureLib[k], locInverse);
	        }
        }
    }
    wdeFeatures.sort(wdeFeatListSort);
    wdeFeatFocUpdate(-1);
    browseTabFunctionality('WDE_features');
}

window.wdeAnnoAddFeature = wdeAnnoAddFeature;
function wdeAnnoAddFeature(feat, locString) {
    var myFeat = feat.slice(0);
    myFeat[1] = locString;
    myFeat[10] = "";
    var newPos = wdeFeatures.length;
    // Keep it unique
    for (var k = 0; k < newPos; k++) {
        if ((wdeFeatures[k][2] == myFeat[2]) && 
            (wdeFeatures[k][0] == myFeat[0]) && 
            (wdeFeatures[k][1] == myFeat[1]) && 
            (wdeFeatures[k][7] == myFeat[7]) && 
            (wdeFeatures[k][8] == myFeat[8])) {
            return;
        }
    }
    wdeFeatures[newPos] = myFeat;
}

window.wdeFindTestInSeq = wdeFindTestInSeq;
function wdeFindTestInSeq(seq, test){
    if ((seq.length == 0) || (test.length == 0)) {
        return [-1];
    }
    var bigSeq = seq.toLowerCase();
    var smallSeq = test.toLowerCase();
    var startIndex = 0;
    var index;
    var retArr = [];
    var found = 0;

    while ((index = bigSeq.indexOf(smallSeq, startIndex)) > -1) {
        retArr.push(index);
        startIndex = index + 1;
        found = 1;
    }
    if (found == 1) {
        return retArr;
    } else {
        return [-1];
    }
}

window.wdeDeleteLib = wdeDeleteLib;
function wdeDeleteLib() {
    wdeFeatureLib = [];
    localStorage.setItem("wde_FeatureLibData", JSON.stringify(wdeFeatureLib));
    wdeLibFocRepaint();
}

window.wdeSelAddLib = wdeSelAddLib;
function wdeSelAddLib() {
    var seq = wdeCleanSeq(window.frames['WDE_RTF'].document.body.innerHTML);
    var pos = wdeLibExtractFeature(wdeFeatSelFeat, seq);
    if (pos == -1) {
        return;
    }
    wdeLibSelFeat = wdeFeatureLib[pos];
    wdeLibSelNum = pos;
    wdeFeatureLib.sort(wdeLibListSort);
    // Now we have to cut the strings
    for (var i = 0; i < wdeFeatureLib.length ; i++) {
        if (wdeFeatureLib[i] === wdeLibSelFeat) {
            wdeFeatureLib[i] = wdeLibSelFeat.slice(0);
            wdeLibSelNum = i;
        }
    }
    localStorage.setItem("wde_FeatureLibData", JSON.stringify(wdeFeatureLib));
    wdeLibFocRepaint();
    browseTabFunctionality('WDE_feature_lib');
}

window.wdeAllAddLib = wdeAllAddLib;
function wdeAllAddLib() {
    var seq = wdeCleanSeq(window.frames['WDE_RTF'].document.body.innerHTML);
    for (var k = 0; k < wdeFeatures.length; k++) {
        wdeLibExtractFeature(wdeFeatures[k], seq);
    }
    wdeFeatureLib.sort(wdeLibListSort);
    localStorage.setItem("wde_FeatureLibData", JSON.stringify(wdeFeatureLib));
    wdeLibFocRepaint();
    browseTabFunctionality('WDE_feature_lib');
}

window.wdeLibExtractFeature = wdeLibExtractFeature;
function wdeLibExtractFeature(feat,seq) {
    var loc = wdeLibShiftByFirst(feat[1],"First");
    var seqExtr = seq.substring(loc[1],loc[2]);
    var pos = wdeFeatureLib.length;
    if(/complement\((.*)\)\s*$/.test(loc[0])) {
        loc[0] = wdeFeatRevCompLoc(loc[0], (seqExtr.length + 1), 0);
        seqExtr = wdeReverseComplement(seqExtr);
    } 
    if((feat[0] == "source") || (seqExtr.length < 6)) {
        return -1;
    }
    // Keep it unique
    seqExtr = wdeSplitString60(seqExtr);    
    for (var k = 0; k < wdeFeatureLib.length; k++) {
        if ((wdeFeatureLib[k][2] == feat[2]) && 
            (wdeFeatureLib[k][0] == feat[0]) && 
            (wdeFeatureLib[k][1] == loc[0]) && 
            (wdeFeatureLib[k][10] == seqExtr) && 
            (wdeFeatureLib[k][7] == feat[7]) && 
            (wdeFeatureLib[k][8] == feat[8])) {
            return -1;
        }
    }
    wdeFeatureLib[pos] = [feat[0], loc[0], feat[2], feat[3], 
                          feat[4], feat[5], feat[6], feat[7], 
                          feat[8], 1, seqExtr];
    return pos;
}

window.wdeLibShiftByFirst = wdeLibShiftByFirst;
function wdeLibShiftByFirst(loc,offset){
    // if offset == "First" then fist location is used
    var retVal = "";
    var num = "";
    var numFound = 0;
    var firstLoc = "First";
    if (offset != "First") {
        firstLoc = -offset;
    }
    var lastLoc = 0;
    for (var i = 0; i < loc.length ; i++) {
        if (/\d/.test(loc.charAt(i))) {
            num += loc.charAt(i);
            numFound = 1;
        } else {
            if (numFound) {
                 if (firstLoc == "First"){
                     firstLoc = num - 1;
                 }
                 lastLoc = num;
                 num = parseInt(num) - firstLoc;
                 retVal += "" + num;
                 num = "";
                 numFound = 0;
            }
            retVal += loc.charAt(i);
        }
    }
    if (numFound) {
         if (firstLoc == "First"){
             firstLoc = num - 1;
         }
         lastLoc = num;
         num = parseInt(num) - firstLoc;
         retVal += "" + num;
    }
    return [retVal,firstLoc,lastLoc];
}

window.wdeSelFeatures = wdeSelFeatures;
function wdeSelFeatures(checkBox, enzId) {
    if (checkBox.checked) {
        wdeFeatures[enzId][9] = 1;
        
    } else {
        wdeFeatures[enzId][9] = 0;
    }
    wdeFeatFocRepaint();
}

window.wdeSelFFeatMTag = wdeSelFFeatMTag;
function wdeSelFFeatMTag() {
    wdeFeatSelFeat[2] = document.getElementById('WDE_FEAT_TAG').value;
    wdeFeatSelFeat[3] = "U";
}

window.wdeSelFLibMTag = wdeSelFLibMTag;
function wdeSelFLibMTag() {
    wdeLibSelFeat[2] = document.getElementById('WDE_LIB_TAG').value;
    wdeLibSelFeat[3] = "U";
}

window.wdeSetFFeatTagDef = wdeSetFFeatTagDef;
function wdeSetFFeatTagDef() {
    wdeFeatSelFeat[3] = "D";
}

window.wdeSetFLibTagDef = wdeSetFLibTagDef;
function wdeSetFLibTagDef() {
    wdeLibSelFeat[3] = "D";
}

window.wdeSelFFeatType = wdeSelFFeatType;
function wdeSelFFeatType() {
    wdeFeatSelFeat[0] = wdeFeatColor[document.getElementById('WDE_FEAT_TYPE').value][0];
    wdeFeatFocRepaint();
}

window.wdeSelFLibType = wdeSelFLibType;
function wdeSelFLibType() {
    wdeLibSelFeat[0] = wdeFeatColor[document.getElementById('WDE_LIB_TYPE').value][0];
    wdeLibFocRepaint();
}

window.wdeSelFFeatRegType = wdeSelFFeatRegType;
function wdeSelFFeatRegType() {
    var regType = wdeFeatRegColor[document.getElementById('WDE_FEAT_REG_TYPE').value][0];
	if (/\/regulatory_class="[^"]+"/g.test(wdeFeatSelFeat[8])) {
		wdeFeatSelFeat[8] = wdeFeatSelFeat[8].replace(/\/regulatory_class="[^"]+"/g, "/regulatory_class=\"" + regType + "\"");
    } else {
        wdeFeatSelFeat[8] = "/regulatory_class=\"" + regType + "\"\n" + wdeFeatSelFeat[8];
    }
    wdeFeatFocRepaint();
}

window.wdeSelFLibRegType = wdeSelFLibRegType;
function wdeSelFLibRegType() {
    var regType = wdeFeatRegColor[document.getElementById('WDE_LIB_REG_TYPE').value][0];
	if (/\/regulatory_class="[^"]+"/g.test(wdeLibSelFeat[8])) {
		wdeLibSelFeat[8] = wdeLibSelFeat[8].replace(/\/regulatory_class="[^"]+"/g, "/regulatory_class=\"" + regType + "\"");
    } else {
        wdeLibSelFeat[8] = "/regulatory_class=\"" + regType + "\"\n" + wdeLibSelFeat[8];
    }
    wdeLibFocRepaint();
}

window.wdeSelFFeatLoc = wdeSelFFeatLoc;
function wdeSelFFeatLoc() {
    wdeFeatSelFeat[1] =  document.getElementById('WDE_FEAT_LOC').value;
}

window.wdeSelFLibLoc = wdeSelFLibLoc;
function wdeSelFLibLoc() {
    wdeLibSelFeat[1] =  document.getElementById('WDE_LIB_LOC').value;
}

window.wdeSetFFeatSetRev = wdeSetFFeatSetRev;
function wdeSetFFeatSetRev(sel) {
    var loc = wdeFeatSelFeat[1];
    if (loc.length < 1) {
        return;
    }
    if (sel == -1) {
        if(/complement\((.*)\)\s*$/.test(loc)) {
            loc = RegExp.$1;
            sel = 1;
        } else {
            loc = "complement(" + loc + ")";
            sel = 0;
        }
        document.getElementById('WDE_FEAT_LOC').value = loc;
        wdeFeatSelFeat[1] = loc;
    }
    var lButton = document.getElementById("WDE_FEAT_REVCOMP");
    if (sel) {
        lButton.value = "Set Reverse";
    } else {
        lButton.value = "Set Forward";
    }
    
}

window.wdeSetFFeatForVar = wdeSetFFeatForVar;
function wdeSetFFeatForVar() {
    var col = document.getElementById('WDE_FEAT_FCOL').value;
    wdeFeatSelFeat[4] = col.replace(/#+/g, "");
    wdeFeatFocRepaint();
}

window.wdeSetFLibForVar = wdeSetFLibForVar;
function wdeSetFLibForVar() {
    var col = document.getElementById('WDE_LIB_FCOL').value;
    wdeLibSelFeat[4] = col.replace(/#+/g, "");
    wdeLibFocRepaint();
}

window.wdeSetFFeatForDef = wdeSetFFeatForDef;
function wdeSetFFeatForDef() {
    wdeFeatSelFeat[4] = "D";
    wdeFeatFocRepaint();
}

window.wdeSetFLibForDef = wdeSetFLibForDef;
function wdeSetFLibForDef() {
    wdeLibSelFeat[4] = "D";
    wdeLibFocRepaint();
}

window.wdeSetFFeatRevVar = wdeSetFFeatRevVar;
function wdeSetFFeatRevVar() {
    var col = document.getElementById('WDE_FEAT_RCOL').value;
    wdeFeatSelFeat[5] = col.replace(/#+/g, "");
    wdeFeatFocRepaint();
}

window.wdeSetFLibRevVar = wdeSetFLibRevVar;
function wdeSetFLibRevVar() {
    var col = document.getElementById('WDE_LIB_RCOL').value;
    wdeLibSelFeat[5] = col.replace(/#+/g, "");
    wdeLibFocRepaint();
}

window.wdeSetFFeatRevDef = wdeSetFFeatRevDef;
function wdeSetFFeatRevDef() {
    wdeFeatSelFeat[5] = "D";
    wdeFeatFocRepaint();
}

window.wdeSetFLibRevDef = wdeSetFLibRevDef;
function wdeSetFLibRevDef() {
    wdeLibSelFeat[5] = "D";
    wdeLibFocRepaint();
}

window.wdeSelFFeatRegShape = wdeSelFFeatRegShape;
function wdeSelFFeatRegShape() {
    var res = document.getElementById('WDE_FEAT_SHAPE').value;
    if (res == 1) {
        wdeFeatSelFeat[6] = "box";
    } else if (res == 2) {
        wdeFeatSelFeat[6] = "arrow";
    } else {
        wdeFeatSelFeat[6] = "D";
    }
}

window.wdeSelFLibRegShape = wdeSelFLibRegShape;
function wdeSelFLibRegShape() {
    var res = document.getElementById('WDE_LIB_SHAPE').value;
    if (res == 1) {
        wdeLibSelFeat[6] = "box";
    } else if (res == 2) {
        wdeLibSelFeat[6] = "arrow";
    } else {
        wdeLibSelFeat[6] = "D";
    }
}

window.wdeSelFFeatNote = wdeSelFFeatNote;
function wdeSelFFeatNote() {
    wdeFeatSelFeat[7] = "/note=\"" + document.getElementById('WDE_FEAT_NOTE').value +  "\"";
}

window.wdeSelFLibNote = wdeSelFLibNote;
function wdeSelFLibNote() {
    wdeLibSelFeat[7] = "/note=\"" + document.getElementById('WDE_LIB_NOTE').value +  "\"";
}

window.wdeSelFFeatQualif = wdeSelFFeatQualif;
function wdeSelFFeatQualif() {
    wdeFeatSelFeat[8] =  document.getElementById('WDE_FEAT_QUALIF').value;
}

window.wdeSelFLibQualif = wdeSelFLibQualif;
function wdeSelFLibQualif() {
    wdeLibSelFeat[8] =  document.getElementById('WDE_LIB_QUALIF').value;
}

window.wdeSelFLibSeq = wdeSelFLibSeq;
function wdeSelFLibSeq() {
    wdeLibSelFeat[10] =  wdeSplitString60(wdeCleanSeq(document.getElementById('WDE_LIB_SEQ').value));
}

window.wdeSplitString60 = wdeSplitString60;
function wdeSplitString60(str) {
    var retStr = "";
    for (var i = 0 ; i < str.length ; i++) {
        if ((i % 60 == 0) && (i != 0)) {
            retStr += "\n";
        }
        retStr += str.charAt(i);
    }
    return retStr;
}

window.wdeSetFFeatNew = wdeSetFFeatNew;
function wdeSetFFeatNew(loc) {
    wdeFeatSelFeat = ["gene",loc,"Enter Feature Name","U","D","D","arrow","","",1,""];
    wdeFeatSelNum = -1;
    wdeFeatFocRepaint();
}

window.wdeSetFLibNew = wdeSetFLibNew;
function wdeSetFLibNew(loc) {
    wdeLibSelFeat = ["gene",loc,"Enter Feature Name","U","D","D","arrow","","",1,""];
    wdeLibSelNum = -1;
    wdeLibFocRepaint();
}

window.wdeNewFeaturesFromSel = wdeNewFeaturesFromSel;
function wdeNewFeaturesFromSel() {
    var sel;
    var range;
    var loc = "";
    if (window.frames['WDE_RTF'].getSelection) {
        sel = window.frames['WDE_RTF'].getSelection();
        var numb = sel.rangeCount;
        for (var i = sel.rangeCount - 1; i >= 0 ; i--) {
            range = sel.getRangeAt(i);
            var theSelection = "X" + range.toString() + "x";
            range.deleteContents();
            range.insertNode(window.frames['WDE_RTF'].document.createTextNode(theSelection));
        }
        var seqWSel = wdeCleanSeqWithMarks(window.frames['WDE_RTF'].document.body.innerHTML);
        var locCount = 1;
        for (var i = 0; i < seqWSel.length ; i++) {
            if (seqWSel.charAt(i) == "X") {
                loc += locCount;
            } else if (seqWSel.charAt(i) == "x") {
                loc += ".." + (locCount - 1) + ",";
            } else  {
                locCount++;
            } 
        }
        loc = loc.replace(/,$/, "");
        if (numb > 1) {
            loc = "join(" + loc + ")";
        }
        seqWSel = seqWSel.replace(/x/ig, "");
        window.frames['WDE_RTF'].document.body.innerHTML = wdeFormatSeq(seqWSel, wdeZeroOne, wdeNumbers);
    }
    wdeSetFFeatNew(loc);
    wdeRepaint();
    browseTabFunctionality('WDE_features');
}

window.wdeSetFFeatSave = wdeSetFFeatSave;
function wdeSetFFeatSave() {
    var myArr = wdeFeatSelFeat;
    if ((wdeFeatSelNum > -1) && (wdeFeatSelNum < wdeFeatures.length)) {
    	wdeFeatures[wdeFeatSelNum] = myArr;
    }
    if (wdeFeatSelNum == -1) {
        wdeFeatSelNum = wdeFeatures.length;
        wdeFeatures[wdeFeatSelNum] = myArr;
    }
    wdeFeatures.sort(wdeFeatListSort);
    // Now we have to cut the strings
    for (var i = 0; i < wdeFeatures.length ; i++) {
        if (wdeFeatures[i] === myArr) {
            wdeFeatures[i] = myArr.slice(0);
            wdeFeatSelNum = i;
        }
    }
    wdeFeatFocRepaint();
}

window.wdeSetFLibSave = wdeSetFLibSave;
function wdeSetFLibSave() {
    var myArr = wdeLibSelFeat;
    if ((wdeLibSelNum > -1) && (wdeLibSelNum < wdeFeatureLib.length)) {
    	wdeFeatureLib[wdeLibSelNum] = myArr;
    }
    if (wdeLibSelNum == -1) {
        wdeLibSelNum = wdeFeatureLib.length;
        wdeFeatureLib[wdeLibSelNum] = myArr;
    }
    wdeFeatureLib.sort(wdeLibListSort);
    // Now we have to cut the strings
    for (var i = 0; i < wdeFeatureLib.length ; i++) {
        if (wdeFeatureLib[i] === myArr) {
            wdeFeatureLib[i] = myArr.slice(0);
            wdeLibSelNum = i;
        }
    }
    localStorage.setItem("wde_FeatureLibData", JSON.stringify(wdeFeatureLib));
    wdeLibFocRepaint();
}

window.wdeFeatListSort = wdeFeatListSort;
function wdeFeatListSort(a, b) {
    if (/^(\d+)\..*?(\d+)$\s*/.test(wdeFECleanPos(a[1]))) {
	    var firstA = RegExp.$1;
	    var lastA = RegExp.$2;
    } else {
        /^(\d+)\s*/.test(wdeFECleanPos(a[1]));
	    var firstA = RegExp.$1;
	    var lastA = RegExp.$1 + 1;
    }
    if (/^(\d+)\..*?(\d+)$\s*/.test(wdeFECleanPos(b[1]))) {
	    var firstB = RegExp.$1;
 	    var lastB = RegExp.$2;
    } else {
        /^(\d+)\s*/.test(wdeFECleanPos(b[1]));
	    var firstB = RegExp.$1;
	    var lastB = RegExp.$1 + 1;
    }
    if (firstA != firstB) {
        return firstA - firstB;
    }
    if (lastA != lastB) {
        return lastB - lastA;
    }
    // Now the features have exactly the same size
    var typeA = wdeFeatTypeToInt(a[0]);
    var typeB = wdeFeatTypeToInt(b[0]);
    return typeB - typeA;
}

window.wdeLibListSort = wdeLibListSort;
function wdeLibListSort(a, b) {
    if(a[2].toLowerCase() == b[2].toLowerCase()) {
        if(a[10].length == b[10].length) {
            return a[0].localeCompare(b[0]);
        }
        return a[10].length - b[10].length;
    }
    if(a[2].toLowerCase() < b[2].toLowerCase()) {
        return -1;
    }
    if(a[2].toLowerCase() > b[2].toLowerCase()) {
        return 1;
    }
    return 0;
}

window.wdeSetFFeatDel = wdeSetFFeatDel;
function wdeSetFFeatDel() {
    if ((wdeFeatSelNum > -1) && (wdeFeatSelNum < wdeFeatures.length)) {
    	wdeFeatures.splice(wdeFeatSelNum, 1); 
    }
    wdeFeatSelFeat = ["gene","","Enter Feature Name","U","D","D","arrow","","",1,""];
    wdeFeatSelNum = -1;
    wdeFeatFocRepaint();
}

window.wdeSetFLibDel = wdeSetFLibDel;
function wdeSetFLibDel() {
    if ((wdeLibSelNum > -1) && (wdeLibSelNum < wdeFeatureLib.length)) {
    	wdeFeatureLib.splice(wdeLibSelNum, 1); 
    }
    wdeLibSelFeat = ["gene","","Enter Feature Name","U","D","D","arrow","","",1,""];
    wdeLibSelNum = -1;
    localStorage.setItem("wde_FeatureLibData", JSON.stringify(wdeFeatureLib));
    wdeLibFocRepaint();
}

window.wdeFindUserSeq = wdeFindUserSeq;
function wdeFindUserSeq() {
    // All sequence has to be lowecase to save the convesion later
    var seq = wdeCleanSeq(window.frames['WDE_RTF'].document.body.innerHTML).toLowerCase();
    wdeUser[1] = document.getElementById('WDE_USER_SEQ').value;
    wdeUser[0] = document.getElementById('WDE_USER_NAME').value;
    var cutDiff = wdeDigCutPosFor(wdeUser[1]);        
    var cutDiffRev;        
    var restSeq = wdeCleanSeq(wdeUser[1]).toLowerCase();
    if (restSeq.length < 3) {
        alert("At least 3 bp are required!");
        return;
    }   
    var isATCGonly = true;
    var reg = /[^ATGCatgc]/
    if (reg.exec(restSeq)) {
        isATCGonly = false;
    }
    var checkRevComp = false;
    var revCompRestSeq = wdeReverseComplement(restSeq);
    if (restSeq !=  revCompRestSeq) {
        checkRevComp = true;
        cutDiffRev = wdeDigCutPosRev(wdeUser[1]); 
    }
    var restLength = restSeq.length;
    var restPos = "";
    var cutPos = "";
    var restCount = 0;
    // Get the end right
    var end = seq.length - restLength;
    if (end < 1) {
        end = 1;
    }
    // Test all the words for matches
    for (var i = 0; i <= end ; i++) {
        var word = seq.substr(i, restLength);
        if ((isATCGonly && (word == restSeq)) ||
            (!isATCGonly && wdeIsSameSeq(word,restSeq))){
            restCount++;
            var pos = i + wdeZeroOne;
            restPos += ";" + pos + "," + restLength;
            cutPos += wdeGetCutPos(i,cutDiff);
        }
        if ((checkRevComp && isATCGonly && (word == revCompRestSeq)) ||
            (checkRevComp && !isATCGonly && wdeIsSameSeq(word,revCompRestSeq))){
            restCount++;
            var pos = i + wdeZeroOne;
            restPos += ";" + pos + "," + restLength;
            cutPos += wdeGetCutPos(i,cutDiffRev);
        }
    }
    // Test the circular overlap
    if (wdeCircular) {
        for (var i = 1; i < restLength ; i++) {
            var word = seq.substr(end + i, restLength - i) + seq.substr(0, i);
            if ((isATCGonly && (word == restSeq)) ||
                (!isATCGonly && wdeIsSameSeq(word,restSeq))){
                restCount++;
                var pos = end + i + wdeZeroOne;
                restPos += ";" + pos + "," + restLength;
                cutPos += wdeGetCutPos(i,cutDiff);
            }
            if ((checkRevComp && isATCGonly && (word == revCompRestSeq)) ||
                (checkRevComp && !isATCGonly && wdeIsSameSeq(word,revCompRestSeq))){
                restCount++;
                var pos = end + i + wdeZeroOne;
                restPos += ";" + pos + "," + restLength;
                cutPos += wdeGetCutPos(i,cutDiffRev);
            }
        }
    }
    wdeUser[4] = restPos;
    wdeUser[6] = cutPos;
    wdeUser[3] = restCount;
    document.getElementById("WDE_USER_COUNT").innerHTML = "Hits: " + wdeUser[3];
    wdeREdisp = 0;
    wdeRepaint();
}

window.wdeFindRE = wdeFindRE;
function wdeFindRE() {
    // All sequence has to be lowercase to save the conversion later
    var seqPure = wdeCleanSeq(window.frames['WDE_RTF'].document.body.innerHTML).toLowerCase();
    wdeFindREOnSeq(seqPure);
    wdeDrawEnzymes();
    wdeREdisp = 0;
    wdeRepaint();
}


window.wdeFindREOnSeq = wdeFindREOnSeq;
function wdeFindREOnSeq(seqPure) {
    // All sequence has to be lowercase to save the conversion later
    var seq = seqPure;
    var dam = seqPure;
    // Mask Dam methylation
    var regEx1 = /gatc/g;
    dam = dam.replace(regEx1, "gxxc");
    // Mask Dcm methylation
    var dcm = seqPure;
    var regEx2 = /ccagg/g;
    dcm = dcm.replace(regEx2, "cxaxg");
    var regEx3 = /cctgg/g;
    dcm = dcm.replace(regEx3, "cxtxg");
    // Do Both  
    var damDcm = dcm;
    damDcm = damDcm.replace(regEx1, "gxxc");
    
    for (var k = 0; k < wdeEnzy.length; k++) {
        if (wdeDamDcmSel) {
            if (wdeEnzy[k][5] == "N") {
                seq = seqPure;
            }
            if (wdeEnzy[k][5] == "A") {
                seq = dam;
            }
            if (wdeEnzy[k][5] == "C") {
                seq = dcm;
            }
            if (wdeEnzy[k][5] == "D") {
                seq = damDcm;
            }
        }
        var cutDiff = wdeDigCutPosFor(wdeEnzy[k][1]);        
        var cutDiffRev;        
        var restSequence = wdeCleanSeq(wdeEnzy[k][1]);
        var restSeq = restSequence.toLowerCase();
        var isATCGonly = true;
        var reg = /[^ATGCatgc]/
        if (reg.exec(restSeq)) {
            isATCGonly = false;
        }
        var checkRevComp = false;
        var revCompRestSeq = wdeReverseComplement(restSeq);
        if (restSeq !=  revCompRestSeq) {
            checkRevComp = true;
            cutDiffRev = wdeDigCutPosRev(wdeEnzy[k][1]); 
        }
        var restLength = restSeq.length;
        var restPos = "";
        var cutPos = "";
        var restCount = 0;
        // Get the end right
        var end = seq.length - restLength;
        if (end < 1) {
            end = 1;
        }
        // Test all the words for matches
        for (var i = 0; i <= end ; i++) {
            var word = seq.substr(i, restLength);
            if ((isATCGonly && (word == restSeq)) ||
                (!isATCGonly && wdeIsSameSeq(word,restSeq))){
                restCount++;
                var pos = i + wdeZeroOne;
                restPos += ";" + pos + "," + restLength;
                cutPos += wdeGetCutPos(i,cutDiff);
            }
            if ((checkRevComp && isATCGonly && (word == revCompRestSeq)) ||
                (checkRevComp && !isATCGonly && wdeIsSameSeq(word,revCompRestSeq))){
                restCount++;
                var pos = i + wdeZeroOne;
                restPos += ";" + pos + "," + restLength;
                cutPos += wdeGetCutPos(i,cutDiffRev);
            }
        }
        // Test the circular overlap
        if (wdeCircular) {
            for (var i = 1; i < restLength ; i++) {
                var word = seq.substr(end + i, restLength - i) + seq.substr(0, i);
                if ((isATCGonly && (word == restSeq)) ||
                    (!isATCGonly && wdeIsSameSeq(word,restSeq))){
                    restCount++;
                    var pos = end + i + wdeZeroOne;
                    restPos += ";" + pos + "," + restLength;
                    cutPos += wdeGetCutPos(i,cutDiff);
                }
                if ((checkRevComp && isATCGonly && (word == revCompRestSeq)) ||
                    (checkRevComp && !isATCGonly && wdeIsSameSeq(word,revCompRestSeq))){
                    restCount++;
                    var pos = end + i + wdeZeroOne;
                    restPos += ";" + pos + "," + restLength;
                    cutPos += wdeGetCutPos(i,cutDiffRev);
                }
            }
        }
        wdeEnzy[k][3] = restCount;
        wdeEnzy[k][4] = restPos;
        wdeEnzy[k][6] = cutPos;    
    }
}


window.wdeSelREOutsidesSel = wdeSelREOutsidesSel;
function wdeSelREOutsidesSel() {
    var sel, range;
    var selRECut = [];
    if (window.frames['WDE_RTF'].getSelection) {
        sel = window.frames['WDE_RTF'].getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            var seqPure = wdeCleanSeq(range.toString()).toLowerCase();
            wdeFindREOnSeq(seqPure);
            for (var k = 0; k < wdeEnzy.length; k++) {
                selRECut.push(wdeEnzy[k][3]);
            }
            var seqPure = wdeCleanSeq(window.frames['WDE_RTF'].document.body.innerHTML).toLowerCase();
            wdeFindREOnSeq(seqPure);
            for (var k = 0; k < wdeEnzy.length; k++) {
                if ((selRECut[k] == 0) && (wdeEnzy[k][3] > 0)) {
                    wdeEnzy[k][2] = 1;
                } else {
                    wdeEnzy[k][2] = 0;
                }
            }
            wdeDrawEnzymes();
            wdeREdisp = 0;
            wdeRepaint();
            wdeREdisp = 0;
            wdeHighlight();
        }
    }
}


window.wdeDigCutPosFor = wdeDigCutPosFor;
function wdeDigCutPosFor(enz) {
    var pureEnz = wdeCleanSeq(enz);
    var reg = enz.split("/");
    var retVal = "";
    var regEx = /[a-zA-Z]/;
    var pos;
    // Get the bracket positions
    for (var k = 0; k < reg.length; k++) {
        var line = reg[k].split("(");
        if (line.length == 2) {
            pos = parseInt(line[1]);
            if (line[0].match(regEx)) {
                pos = pureEnz.length + pos;
            } else {
                pos = pos * -1;
            }
            retVal += ";" + pos;
        }
    }
    // Get the ^ positions
    pos = 0;
    for (var k = 0; k < enz.length; k++) {
        if (enz.charAt(k) == "^") {
            retVal += ";" + pos;
            k = enz.length;
        }
        if  (enz.charAt(k).match(regEx)) {
            pos++;
        }
    }
    return retVal;
}

window.wdeDigCutPosRev = wdeDigCutPosRev;
function wdeDigCutPosRev(enz) {
    var pureEnz = wdeCleanSeq(enz);
    var reg = enz.split("/");
    var retVal = "";
    var regEx = /[a-zA-Z]/;
    var pos;
    // Get the bracket positions
    for (var k = 0; k < reg.length; k++) {
        var line = reg[k].split(")");
        if (line.length == 2) {
            pos = parseInt(line[0]);
            if (line[1].match(regEx)) {
                pos = pureEnz.length + pos;
            } else {
                pos = pos * -1;
            }
            retVal += ";" + pos;
        }
    }
    // Get the ^ positions
    pos = 0;
    for (var k = enz.length - 1; k <= 0 ; k--) {
        if (enz.charAt(k) == "^") {
            retVal += ";" + pos;
            k = enz.length;
        }
        if  (enz.charAt(k).match(regEx)) {
            pos++;
        }
    }
    return retVal;
}

window.wdeGetCutPos = wdeGetCutPos;
function wdeGetCutPos(pos,cutDiff) {
    var list = cutDiff.split(";");
    var retVal = "";
    for (var k = 1; k < list.length; k++) {
        var i = pos + parseInt(list[k]);
        retVal += ";" + i;
    }
    return retVal;
}

window.wdeEnzyFoundCheck = wdeEnzyFoundCheck;
function wdeEnzyFoundCheck() {
    if (wdeEnzy[0][3] == "-") {
        wdeFindRE();
    }
}

window.wdeSelEnzymes = wdeSelEnzymes;
function wdeSelEnzymes(checkBox, enzId) {
    if (checkBox.checked) {
        wdeEnzy[enzId][2] = 1;
        
    } else {
        wdeEnzy[enzId][2] = 0;
    }
    wdeDrawEnzymes();
}

window.wdeSelREdeselect = wdeSelREdeselect;
function wdeSelREdeselect() {
    for (var k = 0; k < wdeEnzy.length; k++) {
        wdeEnzy[k][2] = 0;
    }
    wdeDrawEnzymes();
}

window.wdeSelREselMLE = wdeSelREselMLE;
function wdeSelREselMLE(sel) {
    var rsNr = document.getElementById('RESTRICTION_NR').value;
    wdeSelREsel(sel, rsNr);
}

window.wdeSelREsel = wdeSelREsel;
function wdeSelREsel(sel, rsNr) {
    wdeEnzyFoundCheck();
    for (var k = 0; k < wdeEnzy.length; k++) {
        if (((sel == "L") && (wdeEnzy[k][3] < rsNr)) ||
            ((sel == "E") && (wdeEnzy[k][3] == rsNr)) ||
            ((sel == "M") && (wdeEnzy[k][3] > rsNr))){
            wdeEnzy[k][2] = 1;          
        }
    }
    wdeDrawEnzymes();
}

window.wdeSelREListDS = wdeSelREListDS;
function wdeSelREListDS(sel) {
    var rawList = document.getElementById('RESTRICTION_LIST').value;
    var regEx = / /g;
    var list = rawList.replace(regEx, "");
    var listArr = list.split(",");
    for (var k = 0; k < wdeEnzy.length; k++) {
        for (var i = 0; i < listArr.length; i++) {
            if ((listArr[i].length > 3) && (wdeEnzy[k][0] == listArr[i])){
                if (sel == "S"){
                    wdeEnzy[k][2] = 1;          
                } else {
                    wdeEnzy[k][2] = 0;  
                }
            }
        }
    }
    wdeDrawEnzymes();
}

window.wdeDrawEnzymes = wdeDrawEnzymes;
function wdeDrawEnzymes() {
    var enzyDoc = document.getElementById("WDE_enzymes_spacer");
    var content = '<table border="0">';
    var row = Math.ceil(wdeEnzy.length / 3);
    content += "<tr>";
    content += "<th>Sel</th>";
    content += "<th>&nbsp;&nbsp;Hits</th>";
    content += "<th>Name</th>";
    content += "<th>Sequence</th>";
    content += "<th>&nbsp;&nbsp;&nbsp;</th>";
    content += "<th>Sel</th>";
    content += "<th>&nbsp;&nbsp;Hits</th>";
    content += "<th>Name</th>";
    content += "<th>Sequence</th>";
    content += "<th>&nbsp;&nbsp;&nbsp;</th>";
    content += "<th>Sel</th>";
    content += "<th>&nbsp;&nbsp;Hits</th>";
    content += "<th>Name</th>";
    content += "<th>Sequence</th>";
    content += "</tr>\n";
    
//  alert(wdeEnzy[1][0] + " - " + wdeEnzy[1][4]);
    
    for (var i = 0; i < row; i++) {
        content += "<tr>";
        var bgRed1 = "";
        var bgRed2 = "";
        var bgRed3 = "";
        var chBx1 = "";
        var chBx2 = "";
        var chBx3 = "";
        if (wdeEnzy[i][2] != 0) {
            bgRed1 = ' bgcolor="red"';
            chBx1 = ' checked=""';
        } 
        if (wdeEnzy[i + row][2] != 0) {
            bgRed2 = ' bgcolor="red"';
            chBx2 = ' checked=""';
        } 
        content += "<td" + bgRed1 + ">" + '<input type="checkbox" id="WDE_' + i;
        content += '" onclick="wdeSelEnzymes(this, ' + i + ')"' + chBx1 + '></td>';
        content += '<td style="text-align:right"' + bgRed1 + ">" + wdeEnzy[i][3] + " &nbsp;</td>";
        content += "<td" + bgRed1 + ">" + wdeEnzy[i][0] + "</td>";
        content += "<td" + bgRed1 + ">&nbsp;" + wdeEnzy[i][1] + "</td>";
        content += "<td>&nbsp;&nbsp;&nbsp;</td>";
        
        content += "<td" + bgRed2 + ">" + '<input type="checkbox" id="WDE_' + (i + row);
        content += '" onclick="wdeSelEnzymes(this, ' + (i + row) + ')"' + chBx2 + '></td>';
        content += '<td style="text-align:right"' + bgRed2 + ">" + wdeEnzy[i + row][3] + " &nbsp;</td>";
        content += "<td" + bgRed2 + ">" + wdeEnzy[i + row][0] + "</td>";
        content += "<td" + bgRed2 + ">&nbsp;" + wdeEnzy[i + row][1] + "</td>";
        content += "<td>&nbsp;&nbsp;&nbsp;</td>";

        if ((i + 2 * row) < wdeEnzy.length) {
            if (wdeEnzy[i + 2 * row][2] != 0) {
                bgRed3 = ' bgcolor="red"';
                chBx3 = ' checked=""';
            } 
            content += "<td" + bgRed3 + ">" + '<input type="checkbox" id="WDE_' + (i + 2 * row);
            content += '" onclick="wdeSelEnzymes(this, ' + (i + 2 * row) + ')"' + chBx3 + '></td>';
            content += '<td style="text-align:right"' + bgRed3 + ">" + wdeEnzy[i + 2 * row][3] + " &nbsp;</td>";
            content += "<td" + bgRed3 + ">" + wdeEnzy[i + 2 * row][0] + "</td>";
            content += "<td" + bgRed3 + ">&nbsp;" + wdeEnzy[i + 2 * row][1] + "</td>";
            content += "</tr>\n";
        } else {
            content += "<td></td><td></td><td></td><td></td>";
            content += "</tr>\n";
        }
    }
    content += "</table>";
    enzyDoc.innerHTML = content;
}

window.wdePrintEnzy = wdePrintEnzy;
function wdePrintEnzy() {
    var enzyDoc = document.getElementById("WDE_enzymes_spacer");
    var printWindow = window.open('', '', 'left=0,top=0,width=800,height=600,toolbar=0,scrollbars=0,status=0');
    printWindow.document.write(enzyDoc.innerHTML);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
}

window.wdeDigList = wdeDigList;
function wdeDigList() {
    document.getElementById("WDE_DIGEST").style.height = "500px";
    wdeDigUserChoice = "L";
    var digArr = wdeDigCleanDigList(wdeCircular);
    var retVal = "";
    var lastCut = 0;
    retVal += '<table border="0">';
    retVal += "<tr>";
    retVal += "<th>Fragment Length&nbsp;&nbsp;</th>";
    retVal += "<th>Enzyme 1&nbsp;&nbsp;</th>";
    retVal += "<th>Cut Site 1&nbsp;&nbsp;</th>";
    retVal += "<th>Enzyme 2&nbsp;&nbsp;</th>";
    retVal += "<th>Cut Site 2&nbsp;&nbsp;</th>";
    retVal += "<th>Band Weight&nbsp;&nbsp;</th>";
    retVal += "</tr>\n";
    
    for (var i = 0; i < digArr.length; i++) {
        retVal += "<tr><td style='text-align:right'>" + digArr[i][0];
        retVal += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td>&nbsp;&nbsp;&nbsp;";
        retVal += digArr[i][3] + "</td><td style='text-align:right'>" + (digArr[i][4] - 1 + wdeZeroOne) + "&nbsp;&nbsp;&nbsp;</td><td>&nbsp;&nbsp;&nbsp;";
        retVal += digArr[i][1] + "</td><td style='text-align:right'>" + (digArr[i][2] - 1 + wdeZeroOne);
        retVal += "&nbsp;&nbsp;&nbsp;</td><td style='text-align:right'>" + digArr[i][5] + " ng&nbsp;&nbsp;&nbsp;</td></tr>\n";
    }
    retVal += "</table>";
    window.frames['WDE_DIGEST'].document.body.innerHTML = retVal;
    browseTabFunctionality('WDE_digest');
}

window.wdeDigCleanDigList = wdeDigCleanDigList;
function wdeDigCleanDigList(circ) {
    var allPos = "";
    var sel = 0;
    // Place user defined Sequence
    if (wdeUser[2] && (wdeUser[6] != "")) {
        sel++;
        var listArr = wdeUser[6].split(";");
        for (var k = 1; k < listArr.length; k++) {
            allPos += ";" + wdeUser[0] + "(" + wdeUser[3] + ")," + listArr[k];
        }
    }
    // Place the Enzymes
    for (var k = 0; k < wdeEnzy.length; k++) {
        if (wdeEnzy[k][2]){
            sel++;
	        var listArr = wdeEnzy[k][6].split(";");
	        for (var i = 1; i < listArr.length; i++) {
	            allPos += ";" + wdeEnzy[k][0] + "(" + wdeEnzy[k][3] + ")," + listArr[i];
	        }
        }
    }
    if (sel == 0) {
        alert("Find & Select Restriction Enzymes first!");
    } else {
	    var listArr = allPos.split(";");
	    var toSort = [];
	    // [0]  Fragment Length
	    // [1]  Enzym End
	    // [2]  Position End
	    // [3]  Enzyme Start
	    // [4]  Position Start
	    // [5]  Weight in ng
	    
	    var lastPos = 1;
	    var lastEnz = "Start";
	    var amount = document.getElementById('WDE_DIGEST_AMOUNT').value;
	    var seqLength = wdeCleanSeq(window.frames['WDE_RTF'].document.body.innerHTML).length;
	    var baseWeight = amount / seqLength;
	    var weight;
        for (var i = 1; i < listArr.length; i++) {
            var line = listArr[i].split(",");
            toSort[(i - 1)] = [0,line[0],line[1]];
        }
        toSort.sort(wdeDigSortPos);
        for (var i = 0; i < toSort.length; i++) {
            var curPos = parseInt(toSort[i][2]);
            var size = curPos - lastPos;
            toSort[i][0] = size;
	        toSort[i][3] = lastEnz;
            toSort[i][4] = lastPos;
            weight = size * baseWeight;
            toSort[i][5] = weight.toFixed(2);
	        lastEnz = toSort[i][1];
            lastPos = curPos;
        }
        var rest = seqLength - lastPos;
        if (circ) {
            toSort[0][0] = toSort[0][0] + rest + 1;
	        toSort[0][3] = lastEnz;
            toSort[0][4] = lastPos;
            weight = toSort[0][0] * baseWeight;
            toSort[0][5] = weight.toFixed(2);
        } else {
            weight = rest * baseWeight;
            toSort[toSort.length] = [rest,"End",seqLength,lastEnz,lastPos,weight.toFixed(2)];
        }
        toSort.sort(wdeDigSortFrag);
    }
    return toSort;
}

window.wdeDigSortPos = wdeDigSortPos;
function wdeDigSortPos(a, b) {
    if (a[2] != b[2]) {
        return a[2] - b[2];
    } else {
        return a[1].localeCompare(b[1]);
    }
}

window.wdeDigSortFrag = wdeDigSortFrag;
function wdeDigSortFrag(a, b) {
    if (a[0] != b[0]) {
        return b[0] - a[0];
    } else {
        return a[1].localeCompare(b[1]);
    }
}

window.wdeDigAsGelPic = wdeDigAsGelPic;
function wdeDigAsGelPic() {
    document.getElementById("WDE_DIGEST").style.height = "500px";
    wdeDigUserChoice = "G";
    var retVal = wdeDigCreateSVG();
    wdeDigShowSVG(retVal, 750, 450);
}

window.wdeDigCreateSVG = wdeDigCreateSVG;
function wdeDigCreateSVG() {
    var digArr = wdeDigCleanDigList(wdeCircular);
    var markString = document.getElementById('WDE_DIGEST_MARKER').value;
    var rawMarker = markString.split(";");
    var markArr = [];
    for (var i = 0; i < rawMarker.length; i++) {
        var line = rawMarker[i].split(",");
        markArr[i] = [line[0],"","","","",line[1]];
    }
    markArr.sort(wdeDigSortFrag);
    digArr.sort(wdeDigSortFrag);
    var drawMark = wdeDigCleanBands(markArr);
    var drawDig = wdeDigCleanBands(digArr);
    var maxBandWeight = 0;
    for (var i = 0; i < drawMark.length; i++) {
        if (parseInt(drawMark[i][1]) > maxBandWeight) {
            maxBandWeight = parseInt(drawMark[i][1]);
        }
    }
    for (var i = 0; i < drawDig.length; i++) {
        if (parseInt(drawDig[i][1]) > maxBandWeight) {
            maxBandWeight = parseInt(drawDig[i][1]);
        }
    }
    var retVal = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='-800 -100 2080 1200'>";
    retVal += "<text x='12' y='-50' font-family='Arial' font-size='40' fill='black'>Digest</text>";
    retVal += "<text x='212' y='-50' font-family='Arial' font-size='40' fill='black'>Marker</text>";
    retVal += "<rect x='0' y='-15' width='150' height='30' style='fill:white;stroke:black;stroke-width:5' />";
    retVal += "<rect x='200' y='-15' width='150' height='30' style='fill:white;stroke:black;stroke-width:5' />";
    // Draw Marker
    var color = 0;
    for (var i = 0; i < drawMark.length; i++) {
        if (!wdeDigVBandBlack) {
            color = Math.floor(255 - 255 * parseInt(drawMark[i][1]) / maxBandWeight);
        }
        retVal += wdeDigSVGBand(210,drawMark[i][0],color);
    }
    // Draw Digest
    for (var i = 0; i < drawDig.length; i++) {
        if (!wdeDigVBandBlack) {
            var color = Math.floor(255 - 255 * parseInt(drawDig[i][1]) / maxBandWeight);
        }
        retVal += wdeDigSVGBand(10,drawDig[i][0],color);
    }
    retVal += "</svg>";
    return retVal;
}

window.wdeDigCleanBands = wdeDigCleanBands;
function wdeDigCleanBands(arr) {
    var retArr = [];
    var lastBandPos = -1;
    var weight = 0;
    var count = 0;
    for (var i = 0; i < arr.length; i++) {
        var frag = parseInt(arr[i][0]);
        if (frag > 99) {
            if (frag == lastBandPos) {
                weight += parseInt(arr[i][5]);
                count--;
            } else {
                weight = parseInt(arr[i][5]);
            }
            // Strange Function to get the Position somehow correct
            var pos = Math.floor( -450 * ( Math.log(frag) / Math.LN10) + 1900);
            if (pos < 50) {
                pos = 50;
            }
            retArr[count] = [pos,weight];
            lastBandPos = frag;
            count++;
        }
    }
    return retArr;
}

window.wdeDigSVGBand = wdeDigSVGBand;
function wdeDigSVGBand(xPos,yPos,color) {
    var retVal = "<line x1='" + xPos + "' y1='" + yPos;
    retVal += "' x2='" + (xPos + 130) + "' y2='" + yPos;
    retVal += "' style='stroke:rgb(" + color + "," + color + "," + color + ");stroke-width:8' />";
    return retVal; 
}

window.wdeDigShowSVG = wdeDigShowSVG;
function wdeDigShowSVG(svg, x, y) {
    var retVal = svg;
    var regEx1 = /</g;
    retVal = retVal.replace(regEx1, "%3C");
    var regEx2 = />/g;
    retVal = retVal.replace(regEx2, "%3E");
    var regEx3 = /#/g;
    retVal = retVal.replace(regEx3, "%23");
    retVal = '<img src="data:image/svg+xml,' + retVal;
    retVal += '" alt="Digest-SVG" width="' + x + '" height="' + y +'">';
    window.frames['WDE_DIGEST'].document.body.innerHTML = retVal;
    browseTabFunctionality('WDE_digest');
}

window.wdeSaveGel = wdeSaveGel;
function wdeSaveGel() {
    if (wdeDigUserChoice == "L") {
	    var content = window.frames['WDE_DIGEST'].document.body.innerHTML;
	    content = "<html>\n<body>\n" + content + "\n</body>\n</html>\n";
		var fileName = document.getElementById('SEQUENCE_ID').value + "_digest.html";
		wdeSaveFile(fileName, content, "html");
	}
    if (wdeDigUserChoice == "G") {
	    var content = wdeDigCreateSVG();
		var fileName = document.getElementById('SEQUENCE_ID').value + "_gel.svg";
		wdeSaveFile(fileName, content, "svg");
	}
    if ((wdeDigUserChoice == "U") || (wdeDigUserChoice == "M")) {
	    var content = wdeMapSVG(wdeDigUserChoice);
		var fileName = document.getElementById('SEQUENCE_ID').value + "_map.svg";
		wdeSaveFile(fileName, content[0], "svg");
    } 
}

window.wdePrintGel = wdePrintGel;
function wdePrintGel() {
    var printWindow = window.open('', '', 'left=0,top=0,width=800,height=600,toolbar=0,scrollbars=0,status=0');
    printWindow.document.write(window.frames['WDE_DIGEST'].document.body.innerHTML);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
}

window.wdeDigMapDis = wdeDigMapDis;
function wdeDigMapDis(unique) {
    if (unique == "U") {
        wdeDigUserChoice = "U";
    } else {
        wdeDigUserChoice = "M";
    }
    var retVal = wdeMapSVG(unique);
    wdeDigShowSVG(retVal[0], 750, retVal[1]);
    if (retVal[1] > 500) {
         document.getElementById("WDE_DIGEST").style.height = (retVal[1] + 100) + "px";
    }
}

window.wdeMapSVG = wdeMapSVG;
function wdeMapSVG(unique) {
    // A letter is 25 long , if text 0, space below +20 top - 40, line dist 60
    // Use 50 for hight
    var resFound = true;
    if (wdeEnzy[0][3] == "-") {
        resFound = false;
    }
    if (unique == "U") {
        if (resFound == false) {
            wdeFindRE();
            resFound = true;
        }
        wdeSelREsel('E', 1);
    }
    var retVal = "";
    var circ = wdeCircular;
    var seqId = document.getElementById('SEQUENCE_ID').value;
    var seqLength = wdeCleanSeq(window.frames['WDE_RTF'].document.body.innerHTML).length;
    var digArr = [];
    if (resFound == true) {
        digArr = wdeDigCleanDigList(circ);
    }
    var maxY = [-500,500];
    var svgFeat = [];
    // svgFeat[][0] = Sum of all bp in Feature
    // svgFeat[][1] = Position List
    // svgFeat[][2] = Tag
    // svgFeat[][3] = Color
    // svgFeat[][4] = Shape
    // svgFeat[][5] = First Pos
    // svgFeat[][6] = Last Pos
    // svgFeat[][7] = Reverse = 1, Forward = 0
    
    if (wdeDigVShowFeatures) {
		for (var k = 0; k < wdeFeatures.length; k++) {
		    var infSum = 0;
		    var infMin = 999999999;
		    var infMax = 0;
		    var infColor = wdeFinFeatureColor(wdeFeatures, k);
		    var isReverse = 0;
		    if (wdeFeatures[k][9] == 0) {
		        continue;
		    }
		    var posListString = wdeFECleanPos(wdeFeatures[k][1]);
		    if (posListString.length <= 0) {
		        continue;
		    }
		    if (/complement\(.+\)/g.test(wdeFeatures[k][1])) {
	            isReverse = 1;
	        }
		    var posList = posListString.split(",");
		    for (var i = 0; i < posList.length; i++) {
		        var singPos = posList[i].split(".");
		        if (parseInt(singPos[0]) < infMin) {
		            infMin = parseInt(singPos[0]);
		        }
		        if (parseInt(singPos[0]) > infMax) {
		            infMax = parseInt(singPos[0]);
		        }
		        if ((singPos.length == 2) && (parseInt(singPos[1]) > 1)) {
		            infSum += parseInt(singPos[1]) - parseInt(singPos[0]) - 1;
			        if (parseInt(singPos[1]) < infMin) {
			            infMin = parseInt(singPos[1]);
			        }
			        if (parseInt(singPos[1]) > infMax) {
			            infMax = parseInt(singPos[1]);
			        }
		        }
		    }
		    if (!((infMin <= 1) && (infMax >= seqLength))) {
		        // no full length features
		        svgFeat[svgFeat.length] = [infSum,wdeFeatures[k][1],wdeFeatures[k][2],infColor[0],wdeFeatures[k][6],infMin,infMax,isReverse];
		    }
		}
    }
    
    if (circ) {
        // Enzyme Array:
    	// [0]  Fragment Length
	    // [1]  Enzym End
	    // [2]  Position End
	    // [3]  Enzyme Start
	    // [4]  Position Start
	    // [5]  Weight in ng
	    // Function Adds:
	    // [6]  quar
	    // [7]  x1
	    // [8]  y1
	    // [9]  x2
	    // [10]  y2
	    // [11]  x3
	    // [12]  y3
	    // [13]  color
	    // [14]  print name
	    retVal += "<circle cx='0' cy='0' r='450' stroke='black' stroke-width='6' fill='white' />";
	    retVal += "<text x='0' y='-70' font-family='Courier' font-size='40' fill='black' text-anchor='middle'>" +  seqId + "</text>";
	    var base = "" + seqLength + " bp";
	    retVal += "<text x='0' y='70' font-family='Courier' font-size='40' fill='black' text-anchor='middle'>" +  base + "</text>";

	    if (wdeDigVShowFeatures) {
	        svgFeat.sort(wdeDigSVGFEatSort);
	        for (var k = 0; k < svgFeat.length; k++) {
	            var outText = svgFeat[k][2] + "(" + (svgFeat[k][5] - 1 + wdeZeroOne) + ".." + (svgFeat[k][6] - 1 + wdeZeroOne) + ")";
	            var featMPos = Math.floor((svgFeat[k][5] + svgFeat[k][6] ) / 2);
		        var posList = wdeFECleanPos(svgFeat[k][1]).split(",");
	            for (var i = 0; i < posList.length; i++) {
	                var featStart = 0;
	                var featEnd = 0;
	                var singPos = posList[i].split(".");
	                var smallStart = 0;
	                if (parseInt(singPos[0]) > 0) {
	                    featStart = (parseInt(singPos[0]) - 1) / seqLength;
	                    smallStart = featStart;
	                }
	                if (singPos.length == 1) {
		                featEnd = (parseInt(singPos[0])) / seqLength;
	                }
	                if (singPos.length == 2) {
		                if (parseInt(singPos[1]) > 1) {
		                    featEnd = (parseInt(singPos[1]) - 1) / seqLength;
		                    smallStart = ((parseInt(singPos[1]) + parseInt(singPos[0])) / 2) / seqLength;
		                }
		                if (parseInt(singPos[1]) == 1) {
		                    featEnd = (parseInt(singPos[0])) / seqLength;
		                }
	                }
	                if ((featEnd - featStart) < 0.01) {
	                    featStart = smallStart;
	                    featEnd = featStart + 0.01;
	                }  
	                var fCol = svgFeat[k][3];
                	var fiftyPlus;
                	if ((featEnd - featStart) > 0.5) {
                        fiftyPlus = 1;
                    } else {
                        fiftyPlus = 0;
                    }
	                var radStart = 2 * Math.PI * featStart;
	                var radEnd = 2 * Math.PI * featEnd;
	                var x1 = Math.round(430 * Math.sin(radStart));
	                var y1 = Math.round(-430 * Math.cos(radStart));
	                if (svgFeat[k][4] == "box") {
	                    var x1 = Math.round(430 * Math.sin(radStart));
	                    var y1 = Math.round(-430 * Math.cos(radStart));
		                var x2 = Math.round(430 * Math.sin(radEnd));
		                var y2 = Math.round(-430 * Math.cos(radEnd));
		                var x3 = Math.round(410 * Math.sin(radEnd));
		                var y3 = Math.round(-410 * Math.cos(radEnd));
		                var x4 = Math.round(410 * Math.sin(radStart));
		                var y4 = Math.round(-410 * Math.cos(radStart));
				        retVal += "<path d='M " + x1 + " " + y1;
	                    // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
				        retVal += " A 430 430 0 " + fiftyPlus + " 1 " + x2 + " " + y2;
				        retVal += " L " + x3 + " " + y3;
				        retVal += " A 410 410 0 " + fiftyPlus + " 0 " + x4 + " " + y4;
				        retVal += " Z' style='fill:" + fCol + ";stroke:" + fCol + ";stroke-width:5;' />"
	                } else {
	                    if (svgFeat[k][7]) {
		                    // Reverse
		                    var x1 = Math.round(420 * Math.sin(radStart));
		                    var y1 = Math.round(-420 * Math.cos(radStart));
			                var x2 = Math.round(450 * Math.sin(radStart + 0.06));
			                var y2 = Math.round(-450 * Math.cos(radStart + 0.06));
			                var x3 = Math.round(430 * Math.sin(radStart + 0.06));
			                var y3 = Math.round(-430 * Math.cos(radStart + 0.06));
			                var x4 = Math.round(430 * Math.sin(radEnd));
			                var y4 = Math.round(-430 * Math.cos(radEnd));
			                var x5 = Math.round(410 * Math.sin(radEnd));
			                var y5 = Math.round(-410 * Math.cos(radEnd));
			                var x6 = Math.round(410 * Math.sin(radStart + 0.06));
			                var y6 = Math.round(-410 * Math.cos(radStart + 0.06));
			                var x7 = Math.round(390 * Math.sin(radStart + 0.06));
			                var y7 = Math.round(-390 * Math.cos(radStart + 0.06));
					        retVal += "<path d='M " + x1 + " " + y1;
					        retVal += " L " + x2 + " " + y2;
					        retVal += " L " + x3 + " " + y3;
		                    // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
					        retVal += " A 430 430 0 " + fiftyPlus + " 1 " + x4 + " " + y4;
					        retVal += " L " + x5 + " " + y5;
					        retVal += " A 410 410 0 " + fiftyPlus + " 0 " + x6 + " " + y6;
					        retVal += " L " + x7 + " " + y7;
					        retVal += " Z' style='fill:" + fCol + ";stroke:" + fCol + ";stroke-width:5;' />"
				        } else {
		                    // Forward
		                    var x1 = Math.round(430 * Math.sin(radStart));
		                    var y1 = Math.round(-430 * Math.cos(radStart));
			                var x2 = Math.round(430 * Math.sin(radEnd - 0.06));
			                var y2 = Math.round(-430 * Math.cos(radEnd - 0.06));
			                var x3 = Math.round(450 * Math.sin(radEnd - 0.06));
			                var y3 = Math.round(-450 * Math.cos(radEnd - 0.06));
			                var x4 = Math.round(420 * Math.sin(radEnd));
			                var y4 = Math.round(-420 * Math.cos(radEnd));
			                var x5 = Math.round(390 * Math.sin(radEnd - 0.06));
			                var y5 = Math.round(-390 * Math.cos(radEnd - 0.06));
			                var x6 = Math.round(410 * Math.sin(radEnd - 0.06));
			                var y6 = Math.round(-410 * Math.cos(radEnd - 0.06));
			                var x7 = Math.round(410 * Math.sin(radStart));
			                var y7 = Math.round(-410 * Math.cos(radStart));
					        retVal += "<path d='M " + x1 + " " + y1;
		                    // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
					        retVal += " A 430 430 0 " + fiftyPlus + " 1 " + x2 + " " + y2;
					        retVal += " L " + x3 + " " + y3;
					        retVal += " L " + x4 + " " + y4;
					        retVal += " L " + x5 + " " + y5;
					        retVal += " L " + x6 + " " + y6;
					        retVal += " A 410 410 0 " + fiftyPlus + " 0 " + x7 + " " + y7;
					        retVal += " Z' style='fill:" + fCol + ";stroke:" + fCol + ";stroke-width:5;' />"
				        }
	                }
	            }
            	radStart = 2 * Math.PI * featMPos  / seqLength;
                var x11 = Math.round(430 * Math.sin(radStart));
                var y11 = Math.round(-430 * Math.cos(radStart));
                var x12 = Math.round(455 * Math.sin(radStart));
                var y12 = Math.round(-455 * Math.cos(radStart));
		        retVal += "<polyline points='" + x11 + "," + y11;
		        retVal += " " + x12 + "," + y12;
		        retVal += "' style='stroke:" + fCol + ";stroke-width:5;fill:none' />";
		        digArr[digArr.length] =[0,"Feat",featMPos,0,0,0,0,0,0,0,0,0,0,fCol,outText];		        
	        }
	    }
	    for (var k = 0 ; k < digArr.length ; k++) {
	        var rad = 2 * Math.PI * digArr[k][2] / seqLength;
	        digArr[k][6] = Math.floor(4 * digArr[k][2] / seqLength);
	        digArr[k][7] = Math.round(450 * Math.sin(rad)); // x1
	        digArr[k][8] = Math.round(-450 * Math.cos(rad)); // y1
	        digArr[k][9] = Math.round(475 * Math.sin(rad)); // x2
	        digArr[k][10] = Math.round(-475 * Math.cos(rad)); // y2
	        digArr[k][11] = Math.round(500 * Math.sin(rad)); // x3
	        digArr[k][12] = Math.round(-500 * Math.cos(rad)); // y4
	        if ((typeof digArr[k][13] === 'undefined') || (digArr[k][13].length < 1)) {
	            digArr[k][13] = "#000000"; // color
	        }
	        if ((typeof digArr[k][14] === 'undefined') || (digArr[k][14].length < 1)) {
	            digArr[k][14] = (digArr[k][2] - 1 + wdeZeroOne) + " " + digArr[k][1]; // name
	        }
	    }
	    digArr.sort(wdeDigMapSort);
	    var yPos = [[60,-10,-10,60],[-1,1,1,-1]];
	    for (var k = 0 ; k < digArr.length ; k++) {
	        var quar = digArr[k][6];
	        var x1 = digArr[k][7];
	        var y1 = digArr[k][8];
	        var x2 = digArr[k][9];
	        var y2 = digArr[k][10];
	        var x3 = digArr[k][11];
	        var y3 = digArr[k][12];
	        if ((y3 * yPos[1][quar]) < (yPos[0][quar] * yPos[1][quar] + 50)) {
	            y3 = yPos[0][quar] + 50 * yPos[1][quar];
	        }
	        yPos[0][quar] = y3;
	        // For Page Size
	        if ((quar == 0) || (quar == 3)) {
	            if (maxY[0] > y3) {
	                maxY[0] = y3;
	            }
	        } else {
	            if (maxY[1] < y3) {
	                maxY[1] = y3;
	            }
	        }
	        var x4 = x3;
	        if (quar < 2) {
	            x4 = x3 + 20;
	        } else {
	            x4 = x3 - 20;
	        }
	        var y4 = y3;
	        var x5 = x4;
	        var orient;
	        if (quar < 2) {
	            x5 = x4 + 10;
	            orient = "begin";
	        } else {
	            x5 = x4 - 10;
	            orient = "end";
	        }
	        var y5 = y4 + 10;
	        retVal += "<polyline points='" + x1 + "," + y1;
	        retVal += " " + x2 + "," + y2 + " " + x3 + "," + y3;
	        retVal += " " + x4 + "," + y4;
	        retVal += "' style='stroke:" + digArr[k][13] + ";stroke-width:5;fill:none' />";
	        retVal += "<text x='" + x5 + "' y='" + y5;
	        retVal += "' font-family='Courier' font-size='40' fill='" + digArr[k][13] + "' text-anchor='";
	        retVal += orient + "'>" + digArr[k][14] + "</text>";
	    }
    } else {
        digArr.sort(wdeDigSortPos);
        maxY[0] = -700;
        maxY[1] = 300;
        var lastX = [-1500];
        retVal += "<line x1='-750' y1='200' x2='500' y2='200' style='stroke:rgb(0,0,0);stroke-width:8' />";
        var fragStart = wdeZeroOne;
        var fragEnd = seqLength - 1 + wdeZeroOne;
        var descr = seqId + " (" + fragStart + ".." + fragEnd + ")";
	    retVal += "<text x='-125' y='270' font-family='Courier' font-size='40' fill='black' text-anchor='middle'>" +  descr + "</text>";
	    for (var k = 0 ; k < digArr.length ; k++) {
	        var xPos = Math.round(1250 * digArr[k][2] / seqLength - 750);
	        var xLin = xPos;
	        var yLin = 165;
	        var xText = xPos - 10;
	        var yText = 200;
	        var outText = (digArr[k][2] - 1 + wdeZeroOne) + " " + digArr[k][1];
	        var xPixText = Math.round(1.4 * 25 * outText.length);
	        var searchOn = 1;
	        var line = 0;
	        while (searchOn) {
				if(typeof lastX[line] === 'undefined') {
				    lastX[line] = xText + xPixText;
				    searchOn = 0;
				}
				else {
				    if (lastX[line] < xText) {
				        lastX[line] = xText + xPixText;
				        searchOn = 0;
				    }
				}
				yText -= 50;
				if (maxY[0] > yText) {
				    maxY[0] = yText;
				}
                line++;
            }
	        retVal += "<line x1='" + xLin + "' y1='200' x2='" + xLin + "' y2='";
	        retVal += yLin + "' style='stroke:rgb(0,0,0);stroke-width:5' />";
	        retVal += "<text x='" + xText + "' y='" + yText;
	        retVal += "' font-family='Courier' font-size='40' fill='black' text-anchor='begin'>";
	        retVal += outText + "</text>";
	    }
	    if (wdeDigVShowFeatures) {
	        lastX = [-1500];
	        for (var k = 0; k < svgFeat.length; k++) {
		        var yLin = 200;
                var xText = Math.round(1250 * ((svgFeat[k][5] + svgFeat[k][6] ) / 2) / seqLength - 750);
                var yText = yLin + 70;
                var outText = svgFeat[k][2] + "(" + (svgFeat[k][5] - 1 + wdeZeroOne) + ".." + (svgFeat[k][6] - 1 + wdeZeroOne) + ")";
                var xPixText = Math.round(0.7 * 25 * outText.length);
		        var searchOn = 1;
		        var line = 0;
		        var maxFeatX = Math.round(1250 * svgFeat[k][6] / seqLength - 750);
		        if (maxFeatX < xText + xPixText) {
		            maxFeatX = xText + xPixText;
		        }
		        var minFeatX = Math.round(1250 * svgFeat[k][5] / seqLength - 750);
		        if (minFeatX > xText - xPixText) {
		            minFeatX = xText - xPixText;
		        }
		        while (searchOn) {
					if(typeof lastX[line] === 'undefined') {
					    lastX[line] = maxFeatX;
					    searchOn = 0;
					}
					else {
					    if (lastX[line] < minFeatX) {
					        lastX[line] = maxFeatX;
					        searchOn = 0;
					    }
					}
					yText += 130;
					yLin += 130;
					if (maxY[1] < yText) {
					    maxY[1] = yText;
					}
	                line++;
	            }
		        var posList = wdeFECleanPos(svgFeat[k][1]).split(",");
	            for (var i = 0; i < posList.length; i++) {
	                var featStart = 0;
	                var featEnd = 0;
	                var singPos = posList[i].split(".");
	                var smallStart = 0;
	                if (parseInt(singPos[0]) > 0) {
	                    featStart = Math.round(1250 * (parseInt(singPos[0]) - 1) / seqLength - 750);
	                    smallStart = featStart;
	                }
	                if (singPos.length == 1) {
		                featEnd = Math.round(1250 * (parseInt(singPos[0])) / seqLength - 750);
	                }
	                if (singPos.length == 2) {
		                if (parseInt(singPos[1]) > 1) {
		                    featEnd = Math.round(1250 * (parseInt(singPos[1]) - 1) / seqLength - 750);
		                    smallStart = Math.round(1250 * ((parseInt(singPos[1]) + parseInt(singPos[0])) / 2) / seqLength - 750);
		                }
		                if (parseInt(singPos[1]) == 1) {
		                    featEnd = Math.round(1250 * (parseInt(singPos[0])) / seqLength - 750);
		                }
	                }
	                if ( (featEnd - featStart) < 12) {
	                    featStart = smallStart;
	                    featEnd = featStart + 12;
	                }  
	                var fCol = svgFeat[k][3];
	                if (svgFeat[k][4] == "box") {
    	                var x1 = featStart;
	                    var y1 = yLin;
	                    var rWidth = featEnd - x1;
	                    var rLength = 15 ;
				        retVal += "<rect x='" + x1 + "' y='" + y1;
				        retVal += "' width='" + rWidth + "' height='" + rLength;
				        retVal += "' style='fill:" + fCol + ";stroke:" + fCol + ";stroke-width:5;' />"
	                } else {
	                    if (svgFeat[k][7]) {
		                    // Reverse
		                    var x1 = featStart - 1;
		                    var y1 = yLin+ (15/2);
		                    var x2 = featStart + 12;
		                    var y2 = yLin - 12;
		                    var x3 = featStart + 12;
		                    var y3 = yLin;
		                    var x4 = featEnd;
		                    var y4 = yLin;
		                    var x5 = featEnd;
		                    var y5 = yLin + 15;
		                    var x6 = featStart + 12;
		                    var y6 = yLin + 15;
		                    var x7 = featStart + 12;
		                    var y7 = yLin + 15 + 12;
					        retVal += "<polyline points='" + x1 + "," + y1;
					        retVal += " " + x2 + "," + y2 + " " + x3 + "," + y3;
					        retVal += " " + x4 + "," + y4 + " " + x5 + "," + y5;
					        retVal += " " + x6 + "," + y6 + " " + x7 + "," + y7;
					        retVal += " " + x1 + "," + y1;
					        retVal += "' style='stroke:" + fCol + ";stroke-width:5;fill:" + fCol + "' />";
					    } else {
		                    var x1 = featStart;
		                    var y1 = yLin;
		                    var x2 = featEnd - 12;
		                    var y2 = yLin;
		                    var x3 = featEnd - 12;
		                    var y3 = yLin - 12;
		                    var x4 = featEnd + 1;
		                    var y4 = yLin + (15/2);
		                    var x5 = featEnd - 12;
		                    var y5 = yLin + 15 + 12;
		                    var x6 = featEnd - 12;
		                    var y6 = yLin + 15;
		                    var x7 = featStart;
		                    var y7 = yLin + 15;
					        retVal += "<polyline points='" + x1 + "," + y1;
					        retVal += " " + x2 + "," + y2 + " " + x3 + "," + y3;
					        retVal += " " + x4 + "," + y4 + " " + x5 + "," + y5;
					        retVal += " " + x6 + "," + y6 + " " + x7 + "," + y7;
					        retVal += " " + x1 + "," + y1;
					        retVal += "' style='stroke:" + fCol + ";stroke-width:5;fill:" + fCol + "' />";
					    }
	                }
	            }
		        retVal += "<text x='" + xText + "' y='" + yText;
		        retVal += "' font-family='Courier' font-size='40' fill='black' text-anchor='middle'>";
		        retVal += outText + "</text>";
	        }
	    }
    }
    retVal += "</svg>";
    var finYStart = Math.floor((maxY[0] - 100)/10)*10;
    var finYSum = Math.ceil((maxY[0]*-1 + maxY[1] + 200)/10)*10;
    var calcHight = Math.ceil(finYSum * 750 / 2000);
    retVal = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='-1000 " + finYStart + " 2000 " + finYSum + "'>" + retVal;
    return [retVal,calcHight];
}

window.wdeDigMapSort = wdeDigMapSort;
function wdeDigMapSort(a, b) {
    if (a[6] != b[6]) {
        return a[6] - b[6];
    } else {
        if (b[2] == a[2]) {
            if (a[14] == b[14]) {
                if (a[6] == 0) {
		            return a[13].localeCompare(b[13]);
		        } else {
		            return b[13].localeCompare(a[13]);
		        }
            }
            return a[14].localeCompare(b[14]);
        }
        if ((a[6] == 0) || (a[6] == 2)) {
            return b[2] - a[2];
        } else {
            return a[2] - b[2];
        }
    }
}

window.wdeDigSVGFEatSort = wdeDigSVGFEatSort;
function wdeDigSVGFEatSort(a, b) {
    return b[0] - a[0];
}

window.wdeTransInSel = wdeTransInSel;
function wdeTransInSel() {
    var sel, range;
    if (window.frames['WDE_RTF'].getSelection) {
        sel = window.frames['WDE_RTF'].getSelection();
        var theSelection = sel.toString();
        wdeVTransDNA =  wdeCleanSeq(theSelection);
        wdeVTransDNACirc = 0;
        wdeSelTransTable();
        browseTabFunctionality('WDE_translate');
    } 
}

window.wdeTransInAll = wdeTransInAll;
function wdeTransInAll() {
    wdeVTransDNA = wdeCleanSeq(window.frames['WDE_RTF'].document.body.innerHTML);
    wdeVTransDNACirc = wdeCircular;
    wdeSelTransTable();
    browseTabFunctionality('WDE_translate');
}

window.wdeDrawGeneticCode = wdeDrawGeneticCode;
function wdeDrawGeneticCode() {
    // Populate the Code Selection
    var select = document.getElementById('WDE_TRANS_CODE');
    for (var k = 0; k < wdeTranslate.length; k++) {
        var option = document.createElement( 'option' );
        option.value = k;
        option.text = wdeTranslate[k][0];
        if (k == 0) {
           option.setAttribute('selected', true);
        }    
        select.add(option);
    }
    // Draw the Table
    wdeSelTransTable();
}

window.wdeSelTransCode = wdeSelTransCode;
function wdeSelTransCode() {
    wdeVTransCode = document.getElementById("WDE_TRANS_CODE").value;
    wdeSelTransTable();
}

window.wdeSelTransTable = wdeSelTransTable;
function wdeSelTransTable() {
    var transDoc = document.getElementById("WDE_translate_spacer");
    var content = '<table border="0" style="line-height: 1.0; font-size: 80%;">';
    content += "<tr>\n<td></td><td></td><td colspan='4' style='text-align: center'>2nd Letter</td><td></td><td></td>\n</tr>\n";
    content += "<tr>\n<td></td><td></td><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;U</td><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;C</td>";
    content += "<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;A</td><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;G</td><td></td><td></td>\n</tr>\n";
    for (var k = 0 ; k < 4 ; k++) {
	    for (var j = 0 ; j < 4 ; j++) {
	        content += "<tr>\n";
	        if ((k == 0) && (j == 0)) {
	            content += "<td rowspan='16'>1st\nLetter&nbsp;&nbsp;&nbsp;</td>";
	        }
	        if (((k == 0) || (k % 4)) && (j == 0)) {
	            content += "<td rowspan='4'>&nbsp;" + wdeNumberToBase(k) + "&nbsp;&nbsp;&nbsp;</td>";
	        }
	        for (var i = 0 ; i < 4 ; i++) {
	            var one = wdeNumberToBase(k);
	            var two = wdeNumberToBase(i);
	            var tre = wdeNumberToBase(j);
	            var as = wdeTranslateTripToAs(one, two, tre, wdeVTransCode);
	            var asStd = wdeTranslateTripToAs(one, two, tre, 0);
	            var asOrange = 0;
	            if (as != asStd) {
	                asOrange = 1;
	            }
	            var start = wdeTranslateTripToStart(one, two, tre, wdeVTransCode);
	            if (start == "M") {
	                content += '<td>&nbsp;&nbsp;<span style="background-color:green">&nbsp;' + one + two + tre + "&nbsp;</span>";
	            } else if (as == "*") {
	                content += '<td>&nbsp;&nbsp;<span style="background-color:red">&nbsp;' + one + two + tre + "&nbsp;</span>";
	            } else {
	                content += "<td>&nbsp;&nbsp;&nbsp;" + one + two + tre + "&nbsp;";
	            }
	            if (wdeVTransLetter == 1) {
	               as =  wdeProteinOneThree(as);
	            }
	            if ((as == "*") || (as == "*  ")) {
	                as = "Stop";
	            }
	            if (asOrange) {
	                content += '&nbsp;-&nbsp;<span style="background-color:orange">&nbsp;' + as + "&nbsp;</span>&nbsp;&nbsp;</td>";
	            } else {
	                content += "&nbsp;-&nbsp;&nbsp;" + as + "&nbsp;&nbsp;&nbsp;</td>";
	            }
		        if (i == 3) {
		            content += "<td>&nbsp;&nbsp;&nbsp;" + wdeNumberToBase(j) + "&nbsp;</td>";
		        }
	        }    
	        if ((k == 0) && (j == 0)) {
	            content += "<td rowspan='16'>&nbsp;&nbsp;&nbsp;3rd\nLetter</td>";
	        }
	        content += "</tr>\n";
        }
    }

    content += "</table>";
    transDoc.innerHTML = content;
    wdeTransDrawFrame();
}

window.wdeTransDrawFrame = wdeTransDrawFrame;
function wdeTransDrawFrame() {
    var seq = wdeVTransDNA;
    var rSeq = "";
    var frames = [];
    var retVal = "";
    var rOne;
    var rTwo;
    var rTre;
    if (seq.length < 1) {
        window.frames['WDE_TRANS'].document.body.innerHTML = "";
        return;
    }
    var orfs = [];
    // [][0] Name
    // [][1] Start
    // [][2] For 0 Rev 1
    // [][3] Length
    // [][4] Protein Sequence
    
    // translate all six frames
    frames[0] = "";
    frames[1] = "";
    frames[2] = "";
    frames[3] = "";
    frames[4] = "";
    frames[5] = "";
    frames[6] = "";
    frames[7] = "";
    frames[8] = "";
    frames[9] = "";
    frames[10] = "";
    frames[11] = "";
    var mismatch = seq.length % 3;
    if (wdeVTransDNACirc) {
        seq = seq + seq.charAt(0) + seq.charAt(1);
    }
    var end = seq.length - 2;
    for (var i = 0 ; i < end ; i++) {
        var one = seq.charAt(i);
        var two = seq.charAt(i + 1);
        var tre = seq.charAt(i + 2);
        rOne = wdeReverseComplement(tre);
        rTwo = wdeReverseComplement(two);
        rTre = wdeReverseComplement(one);
        rSeq += rTre;
        var as;
        var rAs;
        var start;
        var rStart;
        var regEx = /[atgcATGC]/;
        if ((regEx.exec(one)) && (regEx.exec(two)) && (regEx.exec(tre))) {
            as = wdeTranslateTripToAs(one, two, tre, wdeVTransCode);
            start = wdeTranslateTripToStart(one, two, tre, wdeVTransCode);
            rAs = wdeTranslateTripToAs(rOne, rTwo, rTre, wdeVTransCode);
            rStart = wdeTranslateTripToStart(rOne, rTwo, rTre, wdeVTransCode);
            if (start == "M") {
               start = "MMM";
            } else if (as == "*") {
               start = "***";
            } else {
               start = "---";
            }
            if (rStart == "M") {
               rStart = "MMM";
            } else if (rAs == "*") {
               rStart = "***";
            } else {
               rStart = "---";
            }
            if (wdeVTransLetter == 1) {
               as = wdeProteinOneThree(as);
               rAs = wdeProteinOneThree(rAs);
            } else {
               as = as + "  ";
               rAs = rAs + "  ";
            }
        } else {
            if (wdeVTransLetter == 1) {
               as = "---";
               rAs = "---";
            } else {
               as = "-  ";
               rAs = "-  ";
            }
            start = "---";
            rStart = "---";
        }
        frames[(i % 3)] += as;
        frames[((i % 3) + 3)] += rAs;
        frames[((i % 3) + 6)] += start;
        frames[((i % 3) + 9)] += rStart;
        if (wdeVTransDNACirc && ( i == end - 1)) {
            if (mismatch == 2) {
	            frames[0] += "  1 ->  2";
	            frames[1] += "  2 ->  3";
	            frames[2] += "  3 ->  1";
	            frames[3] += "  1 <-  2";
	            frames[4] += "  2 <-  3";
	            frames[5] += "  3 <-  1";
	         }        
	         if (mismatch == 1) {
	            frames[0] += "  1 ->  3";
	            frames[1] += "  2 ->  1";
	            frames[2] += "  3 ->  2";
	            frames[3] += "  1 <-  3";
	            frames[4] += "  2 <-  1";
	            frames[5] += "  3 <-  2";
            }
        }        
    }
    rSeq += rTwo;
    rSeq += rOne;
    // Chop the extra bases
    if (wdeVTransDNACirc) {
        seq = seq.substring(0,seq.length - 2);
        rSeq = rSeq.substring(0,rSeq.length - 2);
    }
    // Now fill the gaps in the frames
    var circStart = [];
    for (var k = 0; k < 6 ; k++) {
        circStart[k] = ["---","---"]; 
    }
    if (wdeVTransDNACirc) {
        // Find out if the ORF spans the end-start
        for (var k = 6 ; k < 9 ; k++) {
	        var lastMark = "---";
	        for (var i = 0 ; i <= frames[k].length ; i = i + 3) {
	            var word = frames[k].substring(i,(i+3));
	            if (word == "MMM") {
	                lastMark = "MMM";
	            } else if (word == "***") {
	                lastMark = "---";
	            }
	        }
	        circStart[(k-6)][1] = lastMark;
	    }
	    for (var k = 9 ; k < 12 ; k++) {
	        var lastMark = "---";
	        for (var i = frames[k].length - 3 ; i >= 0 ; i = i - 3) {
	            var word = frames[k].substring(i,(i+3));
	            if (word == "MMM") {
	                lastMark = "MMM";
	            } else if (word == "***") {
	                lastMark = "---";
	            }
	        }
	        circStart[(k-6)][1] = lastMark;
	    }
	    // Match the offset
        if (mismatch == 2) {
            circStart[0][0] = circStart[2][1];
            circStart[1][0] = circStart[0][1];
            circStart[2][0] = circStart[1][1];
            circStart[3][0] = circStart[4][1];
            circStart[4][0] = circStart[5][1];
            circStart[5][0] = circStart[3][1];
         }        
         if (mismatch == 1) {
            circStart[0][0] = circStart[1][1];
            circStart[1][0] = circStart[2][1];
            circStart[2][0] = circStart[0][1];
            circStart[3][0] = circStart[5][1];
            circStart[4][0] = circStart[3][1];
            circStart[5][0] = circStart[4][1];
        }
    }
    for (var k = 6 ; k < 9 ; k++) {
        var lastMark = circStart[(k-6)][0];
        var retMark = "";
        for (var i = 0 ; i <= frames[k].length ; i = i + 3) {
            var word = frames[k].substring(i,(i+3));
            if (word == "MMM") {
                retMark += "MMM";
                lastMark = "MMM";
            } else if (word == "***") {
                retMark += "***";
                lastMark = "---";
            } else if (lastMark == "MMM") {
                retMark += "nnn";
            } else {
                retMark += "---";
            }
        }
        frames[k] = retMark;
    }
    for (var k = 9 ; k < 12 ; k++) {
        var lastMark = circStart[(k-6)][0];
        var retMark = "";
        for (var i = frames[k].length - 3 ; i >= 0 ; i = i - 3) {
            var word = frames[k].substring(i,(i+3));
            if (word == "MMM") {
                retMark = "MMM" + retMark;
                lastMark = "MMM";
            } else if (word == "***") {
                retMark = "***" + retMark;
                lastMark = "---";
            } else if (lastMark == "MMM") {
                retMark = "nnn" + retMark;
            } else {
                retMark = "---" + retMark;
            }
        }
        frames[k] = retMark;
    }
    // Now draw the output
    if (wdeVTransOrfView) {
        // Find the ORFs
        var orfCount = 0;
        var seqName = "test";
	    for (var k = 6 ; k < 9 ; k++) {
            var inOrf = 0;
            var orf = "";
            var leng = 0;
            var pos;
	        for (var i = 0 ; i < frames[k].length - 3; i = i + 3) {
	            var word = frames[k].substring(i,(i+3));
	            if (word == "MMM") {
	                orf += frames[(k - 6)].substring(i,(i+3));
	                leng++;
	                if (inOrf == 0) {
	                    pos = i + wdeZeroOne;
	                    inOrf = 1;
	                }
	            } else if (word == "nnn") {
	                orf += frames[(k - 6)].substring(i,(i+3));
	                leng++;
	            } else if (word == "***") {
	                orf += frames[(k - 6)].substring(i,(i+3));
	                if (inOrf) {
	                    orfs[orfCount] = [seqName + "_" + pos + "_" + leng + "_F", pos, 0, leng, orf];
	                    orfCount++;
	                }
	                leng = 0;
	                orf = "";
	                inOrf = 0;
	            }
	        }
	        if (inOrf && wdeVTransDNACirc) {
	            // Find the End
	            var endOrf = k;
	            if (k == 6) {
	                if (mismatch == 2) {
	                    endOrf = 7;
	                }
	                if (mismatch == 1) {
	                    endOrf = 8;
	                }
	            } else if (k == 7) {
	                if (mismatch == 2) {
	                    endOrf = 8;
	                }
	                if (mismatch == 1) {
	                    endOrf = 6;
	                }	            
	            } else { // == 8
	                if (mismatch == 2) {
	                    endOrf = 6;
	                }
	                if (mismatch == 1) {
	                    endOrf = 7;
	                }
	            }
		        for (var i = 0 ; i < frames[endOrf].length - 3 ; i = i + 3) {
		            var word = frames[endOrf].substring(i,(i+3));
		            if (word == "***") {
		                orf += frames[(endOrf - 6)].substring(i,(i+3));
		                if (inOrf) {
		                    orfs[orfCount] = [seqName + "_" + pos + "_" + leng + "_F", pos, 0, leng, orf];
		                    orfCount++;
		                }
		                i = frames[endOrf].length + 5;
		            } else {
		                orf += frames[(endOrf - 6)].substring(i,(i+3));
		                leng++;
		            }
		        }
	        }
	    }
        for (var k = 9 ; k < 12 ; k++) {
            var inOrf = 0;
            var orf = "";
            var leng = 0;
            var pos;
	        for (var i = frames[k].length - 3 ; i >= 0 ; i = i - 3) {
	            var word = frames[k].substring(i,(i+3));
	            if (word == "MMM") {
	                orf += frames[(k - 6)].substring(i,(i+3));
	                leng++;
	                if (inOrf == 0) {
	                    pos = i + wdeZeroOne + 2;
	                    inOrf = 1;
	                }
	            } else if (word == "nnn") {
	                orf += frames[(k - 6)].substring(i,(i+3));
	                leng++;
	            } else if (word == "***") {
	                orf += frames[(k - 6)].substring(i,(i+3));
	                if (inOrf) {
	                    orfs[orfCount] = [seqName + "_" + pos + "_" + leng + "_R", pos, 1, leng, orf];
	                    orfCount++;
	                }
	                leng = 0;
	                orf = "";
	                inOrf = 0;
	            }
	        }
	        if (inOrf && wdeVTransDNACirc) {
	            // Find the End
	            var endOrf = k;
	            if (k == 9) {
	                if (mismatch == 2) {
	                    endOrf = 11;
	                }
	                if (mismatch == 1) {
	                    endOrf = 10;
	                }
	            } else if (k == 10) {
	                if (mismatch == 2) {
	                    endOrf = 9;
	                }
	                if (mismatch == 1) {
	                    endOrf = 11;
	                }	            
	            } else { // == 11
	                if (mismatch == 2) {
	                    endOrf = 10;
	                }
	                if (mismatch == 1) {
	                    endOrf = 9;
	                }
	            }
	            for (var i = frames[endOrf].length - 3 ; i >= 0 ; i = i - 3) {
		            var word = frames[endOrf].substring(i,(i+3));
		            if (word == "***") {
		                orf += frames[(endOrf - 6)].substring(i,(i+3));
		                if (inOrf) {
	                        orfs[orfCount] = [seqName + "_" + pos + "_" + leng + "_R", pos, 1, leng, orf];
		                    orfCount++;
		                }
		                i = -5;
		            } else {
		                orf += frames[(endOrf - 6)].substring(i,(i+3));
		                leng++;
		            }
		        }
	        }
	    }
        // Sort ORFs
        orfs.sort(wdeTransSortOrf);
        
        // Print ORFs
        for (var i = 0 ; i < orfCount ; i++) {
            var minSize = document.getElementById('ORF_AS_NR').value;
            if (minSize <= orfs[i][3]) {
	            retVal += ">" + orfs[i][0] + "\n";
	            var orfSeq = orfs[i][4];
	            var regEx1 = / /g;
		        orfSeq = orfSeq.replace(regEx1, "");
			    for (var j = 0; j < orfSeq.length ; j++) {
			        if (j % 60 == 0) {
			            if (j != 0) {
			                retVal += "\n";
			            }
			        }
			        retVal += orfSeq.charAt(j);    
			    }
                retVal += "\n\n"; 
		    }
        }
    } else {
	    var digits = 0;
	    var length = seq.length;
	        for (var i = length; i > 1 ; i = i / 10) {
	        digits++;
	    }
	    digits++;
	    var segments = Math.ceil(seq.length / 60);
	    for (var i = 0; i < segments ; i++) {
	        var start = 60 * i;
	        var end = 60 * (i + 1);
	        if (end > length) {
	            end = -1;
	        }
	        var pNum = start + 1;
	        var num = pNum.toString();
	        var number = "";
	        for (var j = digits; j > num.length ; j--) {
	            number += " ";
	        }
	        number += num;
	        var spacer = "";
	        for (var j = 0; j < number.length ; j++) {
	            spacer += " ";
	        }
	        var ticks = " |         |         |         |         |         |         |";
	        if (end > -1) {
	            if (wdeVTransFrameNr != 1) {
	                retVal += spacer + "    " + wdeTransHmlPart(frames[2].substring(start,end), frames[8].substring(start,end)) + "\n";
	                retVal += spacer + "   " + wdeTransHmlPart(frames[1].substring(start,end), frames[7].substring(start,end)) + "\n";
	            }
	             retVal += spacer + "  " + wdeTransHmlPart(frames[0].substring(start,end), frames[6].substring(start,end)) + "\n";
	        
	            retVal += spacer + "  " + seq.substring(start,end) + "\n";
	            retVal += number + ticks + "\n";
	            
	            if (wdeVTransRevComp) {
	                retVal += spacer + "  " + rSeq.substring(start,end) + "\n";
	            }
	            if (wdeVTransFrameNr == 6) {
	                retVal += spacer + "    " + wdeTransHmlPart(frames[5].substring(start,end), frames[11].substring(start,end)) + "\n";
	                retVal += spacer + "   " + wdeTransHmlPart(frames[4].substring(start,end), frames[10].substring(start,end)) + "\n";
	                retVal += spacer + "  " + wdeTransHmlPart(frames[3].substring(start,end), frames[9].substring(start,end)) + "\n";
	            }
	            retVal += "\n\n";
	        } else {
	            if (wdeVTransFrameNr != 1) {
	                retVal += spacer + "    " + wdeTransHmlPart(frames[2].substring(start), frames[8].substring(start)) + "\n";
	                retVal += spacer + "   " + wdeTransHmlPart(frames[1].substring(start), frames[7].substring(start)) + "\n";
	            }
	            retVal += spacer + "  " + wdeTransHmlPart(frames[0].substring(start), frames[6].substring(start)) + "\n";
	        
	            retVal += spacer + "  " + seq.substring(start) + "\n";
	            retVal += number + ticks.substring(0, (length - start + 2)) + "\n";
	            if (wdeVTransRevComp) {
	                retVal += spacer + "  " + rSeq.substring(start) + "\n";
	            }
	            if (wdeVTransFrameNr == 6) {
	                retVal += spacer + "    " + wdeTransHmlPart(frames[5].substring(start), frames[11].substring(start)) + "\n";
	                retVal += spacer + "   " + wdeTransHmlPart(frames[4].substring(start), frames[10].substring(start)) + "\n";
	                retVal += spacer + "  " + wdeTransHmlPart(frames[3].substring(start), frames[9].substring(start)) + "\n";
	            }
	            retVal += "\n\n";
	        }
	    }
	}
    window.frames['WDE_TRANS'].document.body.innerHTML = "<pre>" + retVal + "</pre>";
}

window.wdeTransSortOrf = wdeTransSortOrf;
function wdeTransSortOrf(a, b) {
    if (wdeVTransOrfSortSize) {
        if (b[3] == a[3]) {
            return a[1] - b[1];
        }
        return b[3] - a[3];
    } else {
	    if (a[2] != b[2]) {
	        return a[2] - b[2];
	    }
	    if (a[1] == b[1]) {
            return b[3] - a[3];
	    }
	    return a[1] - b[1];
    }    
}

window.wdeTransHmlPart = wdeTransHmlPart;
function wdeTransHmlPart(seq, mark) {
    var retVal = "";
    var lastChar = "-";
    for (var i = 0; i < seq.length ; i++) {
        if (mark.charAt(i) != lastChar) {
            // must be colored, so end it
            if (lastChar != "-") {
                retVal += '</span>';
            }
            if (mark.charAt(i) == "M") {
                retVal += '<span style="background-color:green">';
            }
            if (mark.charAt(i) == "n") {
                retVal += '<span style="background-color:lime">';
            }
            if (mark.charAt(i) == "*") {
                retVal += '<span style="background-color:red">';
            }
            lastChar = mark.charAt(i);
        }
        retVal += seq.charAt(i)
    }
    if (lastChar != "-") {
        retVal += '</span>';
    }
    
    return retVal;
}

window.wdeSaveTrans = wdeSaveTrans;
function wdeSaveTrans() {
    var content = window.frames['WDE_TRANS'].document.body.innerHTML;
    if (wdeVTransOrfView) {
        var regEx1 = /<pre[^>]*>/g;
	    content = content.replace(regEx1, "");
	    var regEx2 = /<\/pre>/g;
	    content = content.replace(regEx2, "");
	    var regEx3 = /&gt;/g;
	    content = content.replace(regEx3, ">");
	    var fileName = document.getElementById('SEQUENCE_ID').value + "_translation.fa";
        wdeSaveFile(fileName, content, "text");
    } else {
	    content = "<html>\n<body>\n" + content + "\n</body>\n</html>\n";
	    var fileName = document.getElementById('SEQUENCE_ID').value + "_translation.html";
	    wdeSaveFile(fileName, content, "html");
    }
};

window.wdePrintTrans = wdePrintTrans;
function wdePrintTrans() {
    var printWindow = window.open('', '', 'left=0,top=0,width=800,height=600,toolbar=0,scrollbars=0,status=0');
    printWindow.document.write(window.frames['WDE_TRANS'].document.body.innerHTML);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
}

//////////////////////////////////////////////////////////////////////
// Now only the reverse complementation and enzyme functions follow //
//////////////////////////////////////////////////////////////////////

// Functions for the code table and translation
window.wdeNumberToBase = wdeNumberToBase;
function wdeNumberToBase(seq){
    var retSeq = "";
    switch (seq) {
        case 0: retSeq = "U";
            break;
        case 1: retSeq = "C";
            break;
        case 2: retSeq = "A";
            break;
        case 3: retSeq = "G";
            break;
    }
    return retSeq;
}

window.wdeBaseToNumber = wdeBaseToNumber;
function wdeBaseToNumber(seq){
    var retSeq = 0;
    switch (seq) {
        case "U": retSeq = 0;
            break;
        case "C": retSeq = 1;
            break;
        case "A": retSeq = 2;
            break;
        case "G": retSeq = 3;
            break;
        case "u": retSeq = 0;
            break;
        case "c": retSeq = 1;
            break;
        case "a": retSeq = 2;
            break;
        case "g": retSeq = 3;
            break;
    }
    return retSeq;
}

window.wdeTranslateTripToAs = wdeTranslateTripToAs;
function wdeTranslateTripToAs(one, two, tre, bas){
    var a = wdeBaseToNumber(one);
    var b = wdeBaseToNumber(two);
    var c = wdeBaseToNumber(tre);    
    var pos = a * 16 + b *4 + c;
    return wdeTranslate[bas][1].charAt(pos);
}

window.wdeTranslateTripToStart = wdeTranslateTripToStart;
function wdeTranslateTripToStart(one, two, tre, bas){
    var a = wdeBaseToNumber(one);
    var b = wdeBaseToNumber(two);
    var c = wdeBaseToNumber(tre);    
    var pos = a * 16 + b *4 + c;
    return wdeTranslate[bas][2].charAt(pos);
}

// Translates single letter code to tree letter code
window.wdeProteinOneThree = wdeProteinOneThree;
function wdeProteinOneThree(seqIn){
    var seq = seqIn.toLowerCase();
    var retSeq = "";
    for (var i = 0; i < seq.length ; i++) {
        switch (seq.charAt(i)) {
            case "g": retSeq += "Gly";
                break;
            case "a": retSeq += "Ala";
                break;
            case "l": retSeq += "Leu";
                break;
            case "m": retSeq += "Met";
                break;
            case "f": retSeq += "Phe";
                break;
            case "w": retSeq += "Trp";
                break;
            case "k": retSeq += "Lys";
                break;
            case "q": retSeq += "Gln";
                break;
            case "e": retSeq += "Glu";
                break;
            case "s": retSeq += "Ser";
                break;
            case "p": retSeq += "Pro";
                break;
            case "v": retSeq += "Val";
                break;
            case "i": retSeq += "Ile";
                break;
            case "c": retSeq += "Cys";
                break;
            case "y": retSeq += "Tyr";
                break;
            case "h": retSeq += "His";
                break;
            case "r": retSeq += "Arg";
                break;
            case "n": retSeq += "Asn";
                break;
            case "d": retSeq += "Asp";
                break;
            case "t": retSeq += "Thr";
                break;
            case "*": retSeq += "***";
                break;
        }               
    }
    return retSeq;
}

// Sequences have to be of same length
// Seq1 is expected to be ATGC
// x masks methylation sites and returns allways false
window.wdeIsSameSeq = wdeIsSameSeq;
function wdeIsSameSeq(seq1, seq2){
    if (seq1.length != seq2.length) {
        return false;
    }
    var retval = true;
    for (var i = 0; i < seq1.length ; i++) {
        if ((seq1.charAt(i) != seq2.charAt(i)) &&
            ((seq1.charAt(i) != "n") || 
             (seq1.charAt(i) != "n") )) {
            if (seq1.charAt(i) == "a") {
                    var regEx = /[ctgyskb]/;
                    if (regEx.exec(seq2.charAt(i))) {
                        return false;
                    }
            }
            if (seq1.charAt(i) == "t") {
                    var regEx = /[acgrsmv]/;
                    if (regEx.exec(seq2.charAt(i))) {
                        return false;
                    }
            }
            if (seq1.charAt(i) == "c") {
                    var regEx = /[atgrwkd]/;
                    if (regEx.exec(seq2.charAt(i))) {
                        return false;
                    }
            }
            if (seq1.charAt(i) == "g") {
                    var regEx = /[atcywmh]/;
                    if (regEx.exec(seq2.charAt(i))) {
                        return false;
                    }
            }
            // Mask for Dam/Dcm methylation
            if (seq1.charAt(i) == "x") {
                return false;
            }
            if (seq1.charAt(i) == "r") {
                    var regEx = /[tcy]/;
                    if (regEx.exec(seq2.charAt(i))) {
                        return false;
                    }
            }
            if (seq1.charAt(i) == "y") {
                    var regEx = /[gar]/;
                    if (regEx.exec(seq2.charAt(i))) {
                        return false;
                    }
            }
            if (seq1.charAt(i) == "s") {
                    var regEx = /[atw]/;
                    if (regEx.exec(seq2.charAt(i))) {
                        return false;
                    }
            }
            if (seq1.charAt(i) == "w") {
                    var regEx = /[cgs]/;
                    if (regEx.exec(seq2.charAt(i))) {
                        return false;
                    }
            }
            if (seq1.charAt(i) == "k") {
                    var regEx = /[acm]/;
                    if (regEx.exec(seq2.charAt(i))) {
                        return false;
                    }
            }
            if (seq1.charAt(i) == "m") {
                    var regEx = /[tgk]/;
                    if (regEx.exec(seq2.charAt(i))) {
                        return false;
                    }
            }
            if (seq1.charAt(i) == "b") {
                    if (seq2.charAt(i) == "a") {
                        return false;
                    }
            }
            if (seq1.charAt(i) == "v") {
                    if (seq2.charAt(i) == "t") {
                        return false;
                    }
            }
            if (seq1.charAt(i) == "d") {
                    if (seq2.charAt(i) == "c") {
                        return false;
                    }
            }
            if (seq1.charAt(i) == "h") {
                    if (seq2.charAt(i) == "g") {
                        return false;
                    }
            }
        }
    }
    return retval;
}

// All non ambiguty codes are lost and u->t
// X and x are kept as selection marks
window.wdeRetAmbiqutyOnly = wdeRetAmbiqutyOnly;
function wdeRetAmbiqutyOnly(seq){
    var retSeq = "";
    for (var i = 0; i < seq.length ; i++) {
        switch (seq.charAt(i)) {
            case "a": retSeq += "a";
                break;
            case "A": retSeq += "A";
                break;
            case "c": retSeq += "c";
                break;
            case "C": retSeq += "C";
                break;
            case "g": retSeq += "g";
                break;
            case "G": retSeq += "G";
                break;
            case "t": retSeq += "t";
                break;
            case "T": retSeq += "T";
                break;
            case "n": retSeq += "n";
                break;
            case "N": retSeq += "N";
                break;
            case "x": retSeq += "x";
                break;
            case "X": retSeq += "X";
                break;
            case "u": retSeq += "t";
                break;
            case "U": retSeq += "T";
                break;
            case "r": retSeq += "r";
                break;
            case "R": retSeq += "R";
                break;
            case "y": retSeq += "y";
                break;
            case "Y": retSeq += "Y";
                break;
            case "m": retSeq += "m";
                break;
            case "M": retSeq += "M";
                break;
            case "k": retSeq += "k";
                break;
            case "K": retSeq += "K";
                break;
            case "s": retSeq += "s";
                break;
            case "S": retSeq += "S";
                break;
            case "w": retSeq += "w";
                break;
            case "W": retSeq += "W";
                break;
            case "b": retSeq += "b";
                break;
            case "B": retSeq += "B";
                break;
            case "d": retSeq += "d";
                break;
            case "D": retSeq += "D";
                break;
            case "h": retSeq += "h";
                break;
            case "H": retSeq += "H";
                break;
            case "v": retSeq += "v";
                break;
            case "V": retSeq += "V";
                break;
        }               
    }
    return retSeq;
}

window.wdeReverseComplement = wdeReverseComplement;
function wdeReverseComplement(seq){
    var revComp = "";
    for (var i = seq.length; i >= 0 ; i--) {
        switch (seq.charAt(i)) {
            case "a": revComp += "t";
                break;
            case "A": revComp += "T";
                break;
            case "c": revComp += "g";
                break;
            case "C": revComp += "G";
                break;
            case "g": revComp += "c";
                break;
            case "G": revComp += "C";
                break;
            case "t": revComp += "a";
                break;
            case "T": revComp += "A";
                break;
            case "n": revComp += "n";
                break;
            case "N": revComp += "N";
                break;
            case "u": revComp += "a";
                break;
            case "U": revComp += "A";
                break;
            case "r": revComp += "y";
                break;
            case "R": revComp += "Y";
                break;
            case "y": revComp += "r";
                break;
            case "Y": revComp += "R";
                break;
            case "s": revComp += "s";
                break;
            case "S": revComp += "S";
                break;
            case "w": revComp += "w";
                break;
            case "W": revComp += "W";
                break;
            case "k": revComp += "m";
                break;
            case "K": revComp += "M";
                break;
            case "m": revComp += "k";
                break;
            case "M": revComp += "K";
                break;
            case "b": revComp += "v";
                break;
            case "B": revComp += "V";
                break;
            case "v": revComp += "b";
                break;
            case "V": revComp += "B";
                break;
            case "d": revComp += "h";
                break;
            case "D": revComp += "H";
                break;
            case "h": revComp += "d";
                break;
            case "H": revComp += "D";
                break;
        }
    }
    return revComp;
}

window.wdeSetDamDcmMeth = wdeSetDamDcmMeth;
function wdeSetDamDcmMeth() {
    var dam = ["AlwI","BcgI","BclI","BsaBI","BspDI","BspEI",
               "BspHI","ClaI","DpnII","EciI","HphI","Hpy188I",
               "Hpy188III","MboI","MboII","NdeII","NruI","TaqI",
               "XbaI"];
    var dcm = ["Acc65I","AlwNI","ApaI","Asp718I","AvaII","BsaI",
               "EaeI","MscI","NlaIV","PflMI","PpuMI","PspGI","PspOMI",
               "Sau96I","ScrFI","SexAI","StuI","StyD4I"];
    var isDam;
    var isDcm;
    for (var k = 0; k < wdeEnzy.length; k++) {
        isDam = false;
        isDcm = false;
        for (var i = 0; i < dam.length; i++) {
            if (dam[i] == wdeEnzy[k][0]){
                isDam = true;
            }
        }
        for (var i = 0; i < dcm.length; i++) {
            if (dcm[i] == wdeEnzy[k][0]){
                isDcm = true;
            }
        }
        if(!isDam && !isDcm) {
            wdeEnzy[k][5] = "N";    //N = no Dam/Dcm
        }
        if(isDam && !isDcm) {
            wdeEnzy[k][5] = "A";    //A = Dam
        }
        if(!isDam && isDcm) {
            wdeEnzy[k][5] = "C";    //C = Dcm
         }
        if(isDam && isDcm) {
            wdeEnzy[k][5] = "D";    //D = Dam and Dcm    
        }
        // Add for Cut Positions
        wdeEnzy[k][6] = "";
    }
}


//////////////////////////////////////////////////////////////////////
// The following functions modify the global values triggered       //
// usually by interface buttons. Possible Values:                   //
//    == -1   -> toggles between the variables                      //
//    >=  0   -> sets variable to provided value                    //
//////////////////////////////////////////////////////////////////////
window.wdeTGCircularLinear = wdeTGCircularLinear;
function wdeTGCircularLinear(sel){
    if (sel == -1) {
	    if (wdeCircular == 1) {
	        sel = 0;
	    } else {
	        sel = 1;
	    }
    }
    var lButton = document.getElementById("wdeCircularButton");
    if (sel) {
        wdeCircular = 1;
        lButton.value = "Circular";
    } else {
        wdeCircular = 0;
        lButton.value = "Linear";
    }
}

window.wdeTGDamDcm = wdeTGDamDcm;
function wdeTGDamDcm(sel,saveLS) {
    if (sel == -1) {
	    if (wdeDamDcmSel == 1) {
	        sel = 0;
	    } else {
	        sel = 1;
	    }
    }
    var box = document.getElementById("WDE_DAM_DCM");
    if (sel) {
        wdeDamDcmSel = 1;
        if (saveLS) {
            localStorage.setItem("wde_wdeDamDcmSel", "1");
        }
        box.checked=true;
    } else {
        wdeDamDcmSel = 0;
        if (saveLS) {
            localStorage.setItem("wde_wdeDamDcmSel", "0");
        }
        box.checked=false;
    }
}

window.wdeTGDigGelBandBlack = wdeTGDigGelBandBlack;
function wdeTGDigGelBandBlack(sel,rPaint,saveLS){
    if (sel == -1) {
	    if (wdeDigVBandBlack == 1) {
	        sel = 0;
	    } else {
	        sel = 1;
	    }
    }
    var lButton = document.getElementById("WDE_DIG_BAND_BLACK");
    if (sel) {
        wdeDigVBandBlack = 1;
        lButton.value = "Simulate Bands Density";
        if (saveLS) {
            localStorage.setItem("wde_BandBlack", "1");
        }
    } else {
        wdeDigVBandBlack = 0;
        lButton.value = "Draw Bands Black";
        if (saveLS) {
            localStorage.setItem("wde_BandBlack", "0");
        }
    }
    if (rPaint) {
        wdeDigAsGelPic();
    }
}

window.wdeTGDigShowFeatures = wdeTGDigShowFeatures;
function wdeTGDigShowFeatures(sel,rPaint,saveLS){
    if (sel == -1) {
	    if (wdeDigVShowFeatures == 1) {
	        sel = 0;
	    } else {
	        sel = 1;
	    }
    }
    var lButton = document.getElementById("WDE_DIG_SHOW_FEATURES");
    if (sel) {
        wdeDigVShowFeatures = 1;
        lButton.value = "Hide Features";
        if (saveLS) {
            localStorage.setItem("wde_BandBlack", "1");
        }
    } else {
        wdeDigVShowFeatures = 0;
        lButton.value = "Show Features";
        if (saveLS) {
            localStorage.setItem("wde_BandBlack", "0");
        }
    }
    if (rPaint) {
        wdeDigMapDis(wdeDigUserChoice);
    }
}

window.wdeTGFeaturesTransp = wdeTGFeaturesTransp;
function wdeTGFeaturesTransp(sel,rPaint){
    if (sel == -1) {
	    if (wdeVFeatTransp == 1) {
	        sel = 0;
	    } else {
	        sel = 1;
	    }
    }
    var lButton = document.getElementById("wdeFeatTransparent");
    if (sel) {
        wdeVFeatTransp = 1;
        lButton.value = "Solid Features";
    } else {
        wdeVFeatTransp = 0;
        lButton.value = "Transparent Features";
    }
    if (rPaint) {
        wdeRepaint();
    }
}

window.wdeTGOrfSort = wdeTGOrfSort;
function wdeTGOrfSort(sel,rPaint){
    if (sel == -1) {
	    if (wdeVTransOrfSortSize == 1) {
	        sel = 0;
	    } else {
	        sel = 1;
	    }
    }
    var lButton = document.getElementById("wdeTransOrfSortButton");
    if (sel) {
        wdeVTransOrfSortSize = 1;
        lButton.value = "Sort ORFs by Position";
    } else {
        wdeVTransOrfSortSize = 0;
        lButton.value = "Sort ORFs by Size";
    }
    if (rPaint) {
        wdeSelTransTable();
    }
}

window.wdeTGOrfView = wdeTGOrfView;
function wdeTGOrfView(sel,rPaint){
    if (sel == -1) {
	    if (wdeVTransOrfView == 1) {
	        sel = 0;
	    } else {
	        sel = 1;
	    }
    }
    var lButton = document.getElementById("wdeTransOrfViewButton");
    if (sel) {
        wdeVTransOrfView = 1;
        lButton.value = "View Frame Translation";
    } else {
        wdeVTransOrfView = 0;
        lButton.value = "View ORF List";
    }
    if (rPaint) {
        wdeSelTransTable();
    }
}

window.wdeTGTransFrameNr = wdeTGTransFrameNr;
function wdeTGTransFrameNr(sel,rPaint){
    if (sel == -1) {
	    if (wdeVTransFrameNr == 6) {
	        sel = 3;
	    } else if (wdeVTransFrameNr == 3) {
	        sel = 1;
	    } else {
	        sel = 6;
	    }
    }
    var lButton = document.getElementById("wdeTransFrameNrButton");
    if (sel == 3) {
        wdeVTransFrameNr = 3;
        lButton.value = "3 Frame";
    } else if (sel == 1) {
        wdeVTransFrameNr = 1;
        lButton.value = "1 Frame";
    } else {
        wdeVTransFrameNr = 6;
        lButton.value = "6 Frame";
    }
    if (rPaint) {
        wdeSelTransTable();
    }
}

window.wdeTGTransRevComp = wdeTGTransRevComp;
function wdeTGTransRevComp(sel,rPaint){
    if (sel == -1) {
	    if (wdeVTransRevComp == 1) {
	        sel = 0;
	    } else {
	        sel = 1;
	    }
    }
    var lButton = document.getElementById("wdeTransRevCompButton");
    if (sel) {
        wdeVTransRevComp = 1;
        lButton.value = "Yes";
    } else {
        wdeVTransRevComp = 0;
        lButton.value = "No";
    }
    if (rPaint) {
        wdeSelTransTable();
    }
}

window.wdeTGTransTreeOne = wdeTGTransTreeOne;
function wdeTGTransTreeOne(sel,rPaint){
    if (sel == -1) {
	    if (wdeVTransLetter == 1) {
	        sel = 0;
	    } else {
	        sel = 1;
	    }
    }
    var lButton = document.getElementById("wdeTransTreeOneButton");
    if (sel) {
        wdeVTransLetter = 1;
        lButton.value = "3 Letter Code";
    } else {
        wdeVTransLetter = 0;
        lButton.value = "1 Letter Code";
    }
    if (rPaint) {
        wdeSelTransTable();
    }
}

window.wdeTGUserSel = wdeTGUserSel;
function wdeTGUserSel(sel) {
    if (sel == -1) {
	    if (wdeUser[2] == 1) {
	        sel = 0;
	    } else {
	        sel = 1;
	    }
    }
    var box = document.getElementById("WDE_USER_SEL");
    if (sel) {
        wdeUser[2] = 1;
        box.checked=true;
    } else {
        wdeUser[2] = 0;
        box.checked=false;
    }
}

window.wdeTGViewNumbers = wdeTGViewNumbers;
function wdeTGViewNumbers(sel,rPaint){
    if (sel == -1) {
	    if (wdeNumbers == 1) {
	        sel = 0;
	    } else {
	        sel = 1;
	    }
    }
    if (sel) {
        wdeNumbers = 1;
    } else {
        wdeNumbers = 0;
    }
    if (rPaint) {
        wdeRepaint();
    }
}

window.wdeTGViewZeroOne = wdeTGViewZeroOne;
function wdeTGViewZeroOne(sel,rPaint,saveLS){
    if (sel == -1) {
	    if (wdeZeroOne == 1) {
	        sel = 0;
	    } else {
	        sel = 1;
	    }
    }
    var lButton = document.getElementById("cmdZeroOneButton");
    if (sel) {
        wdeZeroOne = 1;
        lButton.value = "1";
        if (saveLS) {
            localStorage.setItem("wde_cmdZeroOneButton", "1");
        }
    } else {
        wdeZeroOne = 0;
        lButton.value = "0";
        if (saveLS) {
            localStorage.setItem("wde_cmdZeroOneButton", "0");
        }
    }
    if (rPaint) {
        wdeRepaint();
        wdeFeatFocRepaint();
    }
}

window.wdeUpdateButtonsToDef = wdeUpdateButtonsToDef;
function wdeUpdateButtonsToDef(saveLS) {
    wdeTGCircularLinear(wdeCircular);
    wdeTGDamDcm(wdeDamDcmSel,saveLS);
    wdeTGDigGelBandBlack(wdeDigVBandBlack,0,saveLS);
    wdeTGDigShowFeatures(wdeDigVShowFeatures,0,saveLS)
    wdeTGFeaturesTransp(wdeVFeatTransp, 0);
    wdeTGOrfSort(wdeVTransOrfSortSize,0);
    wdeTGOrfView(wdeVTransOrfView,0);
    wdeTGTransFrameNr(wdeVTransFrameNr,0);
    wdeTGTransRevComp(wdeVTransRevComp,0);
    wdeTGTransTreeOne(wdeVTransLetter,0);
    wdeTGUserSel(wdeUser[2]);
    wdeTGViewNumbers(wdeNumbers,0);
    wdeTGViewZeroOne(wdeZeroOne,0,saveLS);
}

window.wdeCleanInputFields = wdeCleanInputFields;
function wdeCleanInputFields() {
    document.getElementById('wdeInfoField').value = "";
    document.getElementById('SEQUENCE_ID').value = "";
    document.getElementById('SEQUENCE_LENGTH').value = "";
    wdeHideFeatures();
}

window.wdeLoadSampleFile = wdeLoadSampleFile;
function wdeLoadSampleFile() {
    var sampleSeq = "LOCUS       SYNPBR322               4361 bp    DNA     circular SYN 30-SEP-2008\n" +
    "DEFINITION  pBR322\n" +
    "ACCESSION   J01749 K00005 L08654 M10282 M10283 M10286 M10356 M10784 M10785\n" +
    "            M10786 M33694 V01119\n" +
    "VERSION     J01749.1\n" +
    "KEYWORDS    ampicillin resistance; beta-lactamase; cloning vector; drug\n" +
    "            resistance protein; origin of replication; plasmid; tetracycline\n" +
    "            resistance.\n" +
    "SOURCE      Cloning vector pBR322\n" +
    "  ORGANISM  Cloning vector pBR322\n" +
    "            other sequences; artificial sequences; vectors.\n" +
    "FEATURES             Location/Qualifiers\n" +
    "     source          1..4361\n" +
    "                     /organism=\"Cloning vector pBR322\"\n" +
    "                     /mol_type=\"other DNA\"\n" +
    "     regulatory      10..15\n" +
    "                     /note=\"tet (P2) promoter\"\n" +
    "                     /regulatory_class=\"minus_35_signal\"\n" +
    "     regulatory      33..38\n" +
    "                     /note=\"tet (P2) promoter\"\n" +
    "                     /regulatory_class=\"minus_10_signal\"\n" +
    "     regulatory      complement(44..49)\n" +
    "                     /note=\"P1 promoter\"\n" +
    "                     /regulatory_class=\"minus_10_signal\"\n" +
    "     regulatory      complement(64..75)\n" +
    "                     /note=\"P1 promoter\"\n" +
    "                     /regulatory_class=\"minus_35_signal\"\n" +
    "     gene            86..1276\n" +
    "                     /gene=\"tet\"\n" +
    "     CDS             86..1276\n" +
    "                     /gene=\"tet\"\n" +
    "                     /note=\"tetR (confers resistance to tetracycline)\"\n" +
    "                     /codon_start=1\n" +
    "                     /product=\"tetracycline efflux protein, class C\"\n" +
    "                     /translation=\"MKSNNALIVILGTVTLDAVGIGLVMPVLPGLLRDIVHSDSIASH\n" +
    "                     YGVLLALYALMQFLCAPVLGALSDRFGRRPVLLASLLGATIDYAIMATTPVLWILYAG\n" +
    "                     RIVAGITGATGAVAGAYIADITDGEDRARHFGLMSACFGVGMVAGPVAGGLLGAISLH\n" +
    "                     APFLAAAVLNGLNLLLGCFLMQESHKGERRPMPLRAFNPVSSFRWARGMTIVAALMTV\n" +
    "                     FFIMQLVGQVPAALWVIFGEDRFRWSATMIGLSLAVFGILHALAQAFVTGPATKRFGE\n" +
    "                     KQAIIAGMAADALGYVLLAFATRGWMAFPIMILLASGGIGMPALQAMLSRQVDDDHQG\n" +
    "                     QLQGSLAALTSLTSIIGPLIVTAIYAASASTWNGLAWIVGAALYLVCLPALRRGAWSR\n" +
    "                     ATST\"\n" +
    "     RBS             1905..1909\n" +
    "                     /note=\"rop RBS\"\n" +
    "     gene            1915..2106\n" +
    "                     /gene=\"rop\"\n" +
    "     CDS             1915..2106\n" +
    "                     /gene=\"rop\"\n" +
    "                     /exception=\"alternative start codon\"\n" +
    "                     /codon_start=1\n" +
    "                     /transl_table=11\n" +
    "                     /product=\"ROP protein\"\n" +
    "                     /translation=\"MTKQEKTALNMARFIRSQTLTLLEKLNELDADEQADICESLHDH\n" +
    "                     ADELYRSCLARFGDDGENL\"\n" +
    "     rep_origin      complement(2534..3122)\n" +
    "                     /note=\"ORI\"\n" +
    "     gene            complement(3293..4153)\n" +
    "                     /gene=\"bla\"\n" +
    "     CDS             complement(3293..4153)\n" +
    "                     /gene=\"bla\"\n" +
    "                     /note=\"ampR (confers resistance to ampicillin)\"\n" +
    "                     /codon_start=1\n" +
    "                     /product=\"beta-lactamase\"\n" +
    "                     /translation=\"MSIQHFRVALIPFFAAFCLPVFAHPETLVKVKDAEDQLGARVGY\n" +
    "                     IELDLNSGKILESFRPEERFPMMSTFKVLLCGAVLSRVDAGQEQLGRRIHYSQNDLVE\n" +
    "                     YSPVTEKHLTDGMTVRELCSAAITMSDNTAANLLLTTIGGPKELTAFLHNMGDHVTRL\n" +
    "                     DRWEPELNEAIPNDERDTTMPAAMATTLRKLLTGELLTLASRQQLIDWMEADKVAGPL\n" +
    "                     LRSALPAGWFIADKSGAGERGSRGIIAALGPDGKPSRIVVIYTTGSQATMDERNRQIA\n" +
    "                     EIGASLIKHW\"\n" +
    "     sig_peptide     complement(4085..4153)\n" +
    "                     /gene=\"bla signal\"\n" +
    "                     /note=\"required for secretion to the periplasm; cleaved\n" +
    "                     off to form the mature beta-lactamase protein.\"\n" +
    "     RBS             complement(4161..4165)\n" +
    "                     /note=\"bla RBS\"\n" +
    "     regulatory      complement(4197..4202)\n" +
    "                     /note=\"bla (P3) promoter\"\n" +
    "                     /regulatory_class=\"minus_10_signal\"\n" +
    "     regulatory      complement(4218..4223)\n" +
    "                     /note=\"bla (P3) promoter\"\n" +
    "                     /regulatory_class=\"minus_35_signal\"\n" +
    "ORIGIN      \n" +
    "        1 ttctcatgtt tgacagctta tcatcgataa gctttaatgc ggtagtttat cacagttaaa\n" +
    "       61 ttgctaacgc agtcaggcac cgtgtatgaa atctaacaat gcgctcatcg tcatcctcgg\n" +
    "      121 caccgtcacc ctggatgctg taggcatagg cttggttatg ccggtactgc cgggcctctt\n" +
    "      181 gcgggatatc gtccattccg acagcatcgc cagtcactat ggcgtgctgc tagcgctata\n" +
    "      241 tgcgttgatg caatttctat gcgcacccgt tctcggagca ctgtccgacc gctttggccg\n" +
    "      301 ccgcccagtc ctgctcgctt cgctacttgg agccactatc gactacgcga tcatggcgac\n" +
    "      361 cacacccgtc ctgtggatcc tctacgccgg acgcatcgtg gccggcatca ccggcgccac\n" +
    "      421 aggtgcggtt gctggcgcct atatcgccga catcaccgat ggggaagatc gggctcgcca\n" +
    "      481 cttcgggctc atgagcgctt gtttcggcgt gggtatggtg gcaggccccg tggccggggg\n" +
    "      541 actgttgggc gccatctcct tgcatgcacc attccttgcg gcggcggtgc tcaacggcct\n" +
    "      601 caacctacta ctgggctgct tcctaatgca ggagtcgcat aagggagagc gtcgaccgat\n" +
    "      661 gcccttgaga gccttcaacc cagtcagctc cttccggtgg gcgcggggca tgactatcgt\n" +
    "      721 cgccgcactt atgactgtct tctttatcat gcaactcgta ggacaggtgc cggcagcgct\n" +
    "      781 ctgggtcatt ttcggcgagg accgctttcg ctggagcgcg acgatgatcg gcctgtcgct\n" +
    "      841 tgcggtattc ggaatcttgc acgccctcgc tcaagccttc gtcactggtc ccgccaccaa\n" +
    "      901 acgtttcggc gagaagcagg ccattatcgc cggcatggcg gccgacgcgc tgggctacgt\n" +
    "      961 cttgctggcg ttcgcgacgc gaggctggat ggccttcccc attatgattc ttctcgcttc\n" +
    "     1021 cggcggcatc gggatgcccg cgttgcaggc catgctgtcc aggcaggtag atgacgacca\n" +
    "     1081 tcagggacag cttcaaggat cgctcgcggc tcttaccagc ctaacttcga tcactggacc\n" +
    "     1141 gctgatcgtc acggcgattt atgccgcctc ggcgagcaca tggaacgggt tggcatggat\n" +
    "     1201 tgtaggcgcc gccctatacc ttgtctgcct ccccgcgttg cgtcgcggtg catggagccg\n" +
    "     1261 ggccacctcg acctgaatgg aagccggcgg cacctcgcta acggattcac cactccaaga\n" +
    "     1321 attggagcca atcaattctt gcggagaact gtgaatgcgc aaaccaaccc ttggcagaac\n" +
    "     1381 atatccatcg cgtccgccat ctccagcagc cgcacgcggc gcatctcggg cagcgttggg\n" +
    "     1441 tcctggccac gggtgcgcat gatcgtgctc ctgtcgttga ggacccggct aggctggcgg\n" +
    "     1501 ggttgcctta ctggttagca gaatgaatca ccgatacgcg agcgaacgtg aagcgactgc\n" +
    "     1561 tgctgcaaaa cgtctgcgac ctgagcaaca acatgaatgg tcttcggttt ccgtgtttcg\n" +
    "     1621 taaagtctgg aaacgcggaa gtcagcgccc tgcaccatta tgttccggat ctgcatcgca\n" +
    "     1681 ggatgctgct ggctaccctg tggaacacct acatctgtat taacgaagcg ctggcattga\n" +
    "     1741 ccctgagtga tttttctctg gtcccgccgc atccataccg ccagttgttt accctcacaa\n" +
    "     1801 cgttccagta accgggcatg ttcatcatca gtaacccgta tcgtgagcat cctctctcgt\n" +
    "     1861 ttcatcggta tcattacccc catgaacaga aatccccctt acacggaggc atcagtgacc\n" +
    "     1921 aaacaggaaa aaaccgccct taacatggcc cgctttatca gaagccagac attaacgctt\n" +
    "     1981 ctggagaaac tcaacgagct ggacgcggat gaacaggcag acatctgtga atcgcttcac\n" +
    "     2041 gaccacgctg atgagcttta ccgcagctgc ctcgcgcgtt tcggtgatga cggtgaaaac\n" +
    "     2101 ctctgacaca tgcagctccc ggagacggtc acagcttgtc tgtaagcgga tgccgggagc\n" +
    "     2161 agacaagccc gtcagggcgc gtcagcgggt gttggcgggt gtcggggcgc agccatgacc\n" +
    "     2221 cagtcacgta gcgatagcgg agtgtatact ggcttaacta tgcggcatca gagcagattg\n" +
    "     2281 tactgagagt gcaccatatg cggtgtgaaa taccgcacag atgcgtaagg agaaaatacc\n" +
    "     2341 gcatcaggcg ctcttccgct tcctcgctca ctgactcgct gcgctcggtc gttcggctgc\n" +
    "     2401 ggcgagcggt atcagctcac tcaaaggcgg taatacggtt atccacagaa tcaggggata\n" +
    "     2461 acgcaggaaa gaacatgtga gcaaaaggcc agcaaaaggc caggaaccgt aaaaaggccg\n" +
    "     2521 cgttgctggc gtttttccat aggctccgcc cccctgacga gcatcacaaa aatcgacgct\n" +
    "     2581 caagtcagag gtggcgaaac ccgacaggac tataaagata ccaggcgttt ccccctggaa\n" +
    "     2641 gctccctcgt gcgctctcct gttccgaccc tgccgcttac cggatacctg tccgcctttc\n" +
    "     2701 tcccttcggg aagcgtggcg ctttctcata gctcacgctg taggtatctc agttcggtgt\n" +
    "     2761 aggtcgttcg ctccaagctg ggctgtgtgc acgaaccccc cgttcagccc gaccgctgcg\n" +
    "     2821 ccttatccgg taactatcgt cttgagtcca acccggtaag acacgactta tcgccactgg\n" +
    "     2881 cagcagccac tggtaacagg attagcagag cgaggtatgt aggcggtgct acagagttct\n" +
    "     2941 tgaagtggtg gcctaactac ggctacacta gaaggacagt atttggtatc tgcgctctgc\n" +
    "     3001 tgaagccagt taccttcgga aaaagagttg gtagctcttg atccggcaaa caaaccaccg\n" +
    "     3061 ctggtagcgg tggttttttt gtttgcaagc agcagattac gcgcagaaaa aaaggatctc\n" +
    "     3121 aagaagatcc tttgatcttt tctacggggt ctgacgctca gtggaacgaa aactcacgtt\n" +
    "     3181 aagggatttt ggtcatgaga ttatcaaaaa ggatcttcac ctagatcctt ttaaattaaa\n" +
    "     3241 aatgaagttt taaatcaatc taaagtatat atgagtaaac ttggtctgac agttaccaat\n" +
    "     3301 gcttaatcag tgaggcacct atctcagcga tctgtctatt tcgttcatcc atagttgcct\n" +
    "     3361 gactccccgt cgtgtagata actacgatac gggagggctt accatctggc cccagtgctg\n" +
    "     3421 caatgatacc gcgagaccca cgctcaccgg ctccagattt atcagcaata aaccagccag\n" +
    "     3481 ccggaagggc cgagcgcaga agtggtcctg caactttatc cgcctccatc cagtctatta\n" +
    "     3541 attgttgccg ggaagctaga gtaagtagtt cgccagttaa tagtttgcgc aacgttgttg\n" +
    "     3601 ccattgctgc aggcatcgtg gtgtcacgct cgtcgtttgg tatggcttca ttcagctccg\n" +
    "     3661 gttcccaacg atcaaggcga gttacatgat cccccatgtt gtgcaaaaaa gcggttagct\n" +
    "     3721 ccttcggtcc tccgatcgtt gtcagaagta agttggccgc agtgttatca ctcatggtta\n" +
    "     3781 tggcagcact gcataattct cttactgtca tgccatccgt aagatgcttt tctgtgactg\n" +
    "     3841 gtgagtactc aaccaagtca ttctgagaat agtgtatgcg gcgaccgagt tgctcttgcc\n" +
    "     3901 cggcgtcaac acgggataat accgcgccac atagcagaac tttaaaagtg ctcatcattg\n" +
    "     3961 gaaaacgttc ttcggggcga aaactctcaa ggatcttacc gctgttgaga tccagttcga\n" +
    "     4021 tgtaacccac tcgtgcaccc aactgatctt cagcatcttt tactttcacc agcgtttctg\n" +
    "     4081 ggtgagcaaa aacaggaagg caaaatgccg caaaaaaggg aataagggcg acacggaaat\n" +
    "     4141 gttgaatact catactcttc ctttttcaat attattgaag catttatcag ggttattgtc\n" +
    "     4201 tcatgagcgg atacatattt gaatgtattt agaaaaataa acaaataggg gttccgcgca\n" +
    "     4261 catttccccg aaaagtgcca cctgacgtct aagaaaccat tattatcatg acattaacct\n" +
    "     4321 ataaaaatag gcgtatcacg aggccctttc gtcttcaaga a\n" +
    "//\n";

    window.frames['WDE_RTF'].document.body.innerHTML = wdeFormatSeq(wdeCleanSeq(wdeReadFile(sampleSeq, "Sample File")), wdeZeroOne, wdeNumbers);
}

//////////////////////////////////////////////////////////////////////
// The following functions are created using the perl scripts       //
// So do not modify here, modify the scripts in the extra folder!!! //
//                                                                  //
// Attention: The Order is used to sort the features for            //
// display, in the feature list and while writing genebank files    // 
//////////////////////////////////////////////////////////////////////
window.wdePopulateFeatureColors = wdePopulateFeatureColors;
function wdePopulateFeatureColors() {
    wdeFeatColor[0]=["CDS","#2db300","#2db300","arrow"];
    wdeFeatColor[1]=["gene","#ff3333","#ff3333","arrow"];
    wdeFeatColor[2]=["regulatory","#ffff99","#ffff99","arrow"];
    wdeFeatColor[3]=["misc_feature","#b3b3b3","#b3b3b3","arrow"];
    wdeFeatColor[4]=["misc_recomb","#b3b3b3","#b3b3b3","arrow"];
    wdeFeatColor[5]=["misc_difference","#b3b3b3","#b3b3b3","arrow"];
    wdeFeatColor[6]=["exon","#ff9999","#ff9999","arrow"];
    wdeFeatColor[7]=["operon","#ffcccc","#ffcccc","arrow"];
    wdeFeatColor[8]=["intron","#ffe6e6","#ffe6e6","arrow"];
    wdeFeatColor[9]=["polyA_site","#ffd699","#ffd699","arrow"];
    wdeFeatColor[10]=["5'UTR","#ffffcc","#ffffcc","arrow"];
    wdeFeatColor[11]=["3'UTR","#ffebcc","#ffebcc","arrow"];
    wdeFeatColor[12]=["prim_transcript","#ffe6e6","#ffe6e6","arrow"];
    wdeFeatColor[13]=["mRNA","#ffe6e6","#ffe6e6","arrow"];
    wdeFeatColor[14]=["misc_RNA","#ffb3b3","#ffb3b3","arrow"];
    wdeFeatColor[15]=["assembly_gap","#e6e6e6","#e6e6e6","box"];
    wdeFeatColor[16]=["C_region","#ff99cc","#ff99cc","arrow"];
    wdeFeatColor[17]=["centromere","#c8c8c8","#c8c8c8","box"];
    wdeFeatColor[18]=["D-loop","#ff99cc","#ff99cc","arrow"];
    wdeFeatColor[19]=["D_segment","#ff99cc","#ff99cc","arrow"];
    wdeFeatColor[20]=["gap","#e6e6e6","#e6e6e6","box"];
    wdeFeatColor[21]=["iDNA","#cc99ff","#cc99ff","arrow"];
    wdeFeatColor[22]=["J_segment","#ff55aa","#ff55aa","arrow"];
    wdeFeatColor[23]=["mat_peptide","#39e600","#39e600","arrow"];
    wdeFeatColor[24]=["misc_binding","#b3ff99","#b3ff99","arrow"];
    wdeFeatColor[25]=["misc_structure","#ff9999","#ff9999","arrow"];
    wdeFeatColor[26]=["mobile_element","#d9d9d9","#d9d9d9","arrow"];
    wdeFeatColor[27]=["modified_base","#e6e6e6","#e6e6e6","box"];
    wdeFeatColor[28]=["ncRNA","#cc99ff","#cc99ff","arrow"];
    wdeFeatColor[29]=["N_region","#ff55aa","#ff55aa","arrow"];
    wdeFeatColor[30]=["old_sequence","#dcdcff","#dcdcff","box"];
    wdeFeatColor[31]=["oriT","#cccccc","#cccccc","arrow"];
    wdeFeatColor[32]=["precursor_RNA","#ffe6e6","#ffe6e6","arrow"];
    wdeFeatColor[33]=["primer_bind","#ccccff","#faf04b","arrow"];
    wdeFeatColor[34]=["propeptide","#39e600","#39e600","arrow"];
    wdeFeatColor[35]=["protein_bind","#b3ff99","#b3ff99","arrow"];
    wdeFeatColor[36]=["repeat_region","#a6a6a6","#a6a6a6","arrow"];
    wdeFeatColor[37]=["rep_origin","#a6a6a6","#a6a6a6","arrow"];
    wdeFeatColor[38]=["rRNA","#ffe6e6","#ffe6e6","arrow"];
    wdeFeatColor[39]=["S_region","#ff8cc6","#ff8cc6","arrow"];
    wdeFeatColor[40]=["sig_peptide","#39e600","#39e600","arrow"];
    wdeFeatColor[41]=["stem_loop","#ff9999","#ff9999","arrow"];
    wdeFeatColor[42]=["STS","#a6a6a6","#a6a6a6","box"];
    wdeFeatColor[43]=["telomere","#c8c8c8","#c8c8c8","box"];
    wdeFeatColor[44]=["tmRNA","#cc99ff","#cc99ff","arrow"];
    wdeFeatColor[45]=["transit_peptide","#39e600","#39e600","arrow"];
    wdeFeatColor[46]=["tRNA","#ffe6e6","#ffe6e6","arrow"];
    wdeFeatColor[47]=["unsure","#e6e6e6","#e6e6e6","box"];
    wdeFeatColor[48]=["V_region","#ff5bad","#ff5bad","arrow"];
    wdeFeatColor[49]=["V_segment","#ff8cc6","#ff8cc6","arrow"];
    wdeFeatColor[50]=["variation","#e6e6e6","#e6e6e6","box"];
    wdeFeatColor[51]=["source","#ffffff","#ffffff","box"];
    wdePopulateFeatRegColors();
}

window.wdePopulateFeatRegColors = wdePopulateFeatRegColors;
function wdePopulateFeatRegColors() {
    wdeFeatRegColor[0]=["minus_35_signal","#e6ac00","#e6ac00","box"];
    wdeFeatRegColor[1]=["-35_signal","#e6ac00","#e6ac00","box"];
    wdeFeatRegColor[2]=["minus_10_signal","#e6ac00","#e6ac00","box"];
    wdeFeatRegColor[3]=["-10_signal","#e6ac00","#e6ac00","box"];
    wdeFeatRegColor[4]=["TATA_box","#e6ac00","#e6ac00","box"];
    wdeFeatRegColor[5]=["GC_signal","#e6ac00","#e6ac00","box"];
    wdeFeatRegColor[6]=["CAAT_signal","#e6ac00","#e6ac00","box"];
    wdeFeatRegColor[7]=["promoter","#ffd24d","#ffd24d","arrow"];
    wdeFeatRegColor[8]=["ribosome_binding_site","#e6ac00","#e6ac00","box"];
    wdeFeatRegColor[9]=["riboswitch","#e6ac00","#e6ac00","box"];
    wdeFeatRegColor[10]=["attenuator","#e6e600","#e6e600","box"];
    wdeFeatRegColor[11]=["terminator","#ffff33","#ffff33","arrow"];
    wdeFeatRegColor[12]=["polyA_signal_sequence","#e6e600","#e6e600","box"];
    wdeFeatRegColor[13]=["DNase_I_hypersensitive_site","#ffb84d","#ffb84d","box"];
    wdeFeatRegColor[14]=["enhancer","#ffb84d","#ffb84d","box"];
    wdeFeatRegColor[15]=["enhancer_blocking_element","#ffb84d","#ffb84d","box"];
    wdeFeatRegColor[16]=["imprinting_control_region","#ffb84d","#ffb84d","box"];
    wdeFeatRegColor[17]=["insulator","#ffb84d","#ffb84d","box"];
    wdeFeatRegColor[18]=["locus_control_region","#ffb84d","#ffb84d","box"];
    wdeFeatRegColor[19]=["matrix_attachment_region","#ffb84d","#ffb84d","box"];
    wdeFeatRegColor[20]=["recoding_stimulatory_region","#ffb84d","#ffb84d","box"];
    wdeFeatRegColor[21]=["replication_regulatory_region","#ffb84d","#ffb84d","box"];
    wdeFeatRegColor[22]=["response_element","#ffb84d","#ffb84d","box"];
    wdeFeatRegColor[23]=["silencer","#ffb84d","#ffb84d","box"];
    wdeFeatRegColor[24]=["transcriptional_cis_regulatory_region","#ffb84d","#ffb84d","box"];
    wdeFeatRegColor[25]=["other","#ffb84d","#ffb84d","box"];
}

// Populate the Translation array
// This functions are created by the perl script from NCBI data
// See:
// https://www.ncbi.nlm.nih.gov/Taxonomy/taxonomyhome.html/index.cgi?chapter=tgencodes
// ftp://ftp.ncbi.nih.gov/entrez/misc/data/gc.prt
//
// Do not modify!!!!
window.wdePopulateTranslation = wdePopulateTranslation;
function wdePopulateTranslation() {
    wdeTranslate[0]=[
      "Standard  -  only Met Start",
      "FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG",
      "-----------------------------------M----------------------------"];
    wdeTranslate[1]=[
      "Standard",
      "FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG",
      "---M---------------M---------------M----------------------------"];
    wdeTranslate[2]=[
      "Vertebrate Mitochondrial",
      "FFLLSSSSYY**CCWWLLLLPPPPHHQQRRRRIIMMTTTTNNKKSS**VVVVAAAADDEEGGGG",
      "--------------------------------MMMM---------------M------------"];
    wdeTranslate[3]=[
      "Yeast Mitochondrial",
      "FFLLSSSSYY**CCWWTTTTPPPPHHQQRRRRIIMMTTTTNNKKSSRRVVVVAAAADDEEGGGG",
      "----------------------------------MM----------------------------"];
    wdeTranslate[4]=[
      "Mold, Protozoan, Coelenterate Mitochondrial; Mycoplasma; Spiroplasma",
      "FFLLSSSSYY**CCWWLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG",
      "--MM---------------M------------MMMM---------------M------------"];
    wdeTranslate[5]=[
      "Invertebrate Mitochondrial",
      "FFLLSSSSYY**CCWWLLLLPPPPHHQQRRRRIIMMTTTTNNKKSSSSVVVVAAAADDEEGGGG",
      "---M----------------------------MMMM---------------M------------"];
    wdeTranslate[6]=[
      "Ciliate Nuclear; Dasycladacean Nuclear; Hexamita Nuclear",
      "FFLLSSSSYYQQCC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG",
      "-----------------------------------M----------------------------"];
    wdeTranslate[7]=[
      "Echinoderm Mitochondrial; Flatworm Mitochondrial",
      "FFLLSSSSYY**CCWWLLLLPPPPHHQQRRRRIIIMTTTTNNNKSSSSVVVVAAAADDEEGGGG",
      "-----------------------------------M---------------M------------"];
    wdeTranslate[8]=[
      "Euplotid Nuclear",
      "FFLLSSSSYY**CCCWLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG",
      "-----------------------------------M----------------------------"];
    wdeTranslate[9]=[
      "Bacterial, Archaeal and Plant Plastid",
      "FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG",
      "---M---------------M------------MMMM---------------M------------"];
    wdeTranslate[10]=[
      "Alternative Yeast Nuclear",
      "FFLLSSSSYY**CC*WLLLSPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG",
      "-------------------M---------------M----------------------------"];
    wdeTranslate[11]=[
      "Ascidian Mitochondrial",
      "FFLLSSSSYY**CCWWLLLLPPPPHHQQRRRRIIMMTTTTNNKKSSGGVVVVAAAADDEEGGGG",
      "---M------------------------------MM---------------M------------"];
    wdeTranslate[12]=[
      "Alternative Flatworm Mitochondrial",
      "FFLLSSSSYYY*CCWWLLLLPPPPHHQQRRRRIIIMTTTTNNNKSSSSVVVVAAAADDEEGGGG",
      "-----------------------------------M----------------------------"];
    wdeTranslate[13]=[
      "Blepharisma Macronuclear",
      "FFLLSSSSYY*QCC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG",
      "-----------------------------------M----------------------------"];
    wdeTranslate[14]=[
      "Chlorophycean Mitochondrial",
      "FFLLSSSSYY*LCC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG",
      "-----------------------------------M----------------------------"];
    wdeTranslate[15]=[
      "Trematode Mitochondrial",
      "FFLLSSSSYY**CCWWLLLLPPPPHHQQRRRRIIMMTTTTNNNKSSSSVVVVAAAADDEEGGGG",
      "-----------------------------------M---------------M------------"];
    wdeTranslate[16]=[
      "Scenedesmus obliquus Mitochondrial",
      "FFLLSS*SYY*LCC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG",
      "-----------------------------------M----------------------------"];
    wdeTranslate[17]=[
      "Thraustochytrium Mitochondrial",
      "FF*LSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG",
      "--------------------------------M--M---------------M------------"];
    wdeTranslate[18]=[
      "Pterobranchia Mitochondrial",
      "FFLLSSSSYY**CCWWLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSSKVVVVAAAADDEEGGGG",
      "---M---------------M---------------M---------------M------------"];
    wdeTranslate[19]=[
      "Candidate Division SR1 and Gracilibacteria",
      "FFLLSSSSYY**CCGWLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG",
      "---M-------------------------------M---------------M------------"];
    wdeTranslate[20]=[
      "Pachysolen tannophilus Nuclear",
      "FFLLSSSSYY**CC*WLLLAPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG",
      "-------------------M---------------M----------------------------"];
    
}

// Populate the Enzymes array
// This function is created by the perl script from rebase data
// See:
// Roberts, R.J., Vincze, T., Posfai, J., Macelis, D.
// REBASE-a database for DNA restriction and modification: enzymes, genes and genomes.
// Nucleic Acids Res. 43: D298-D299 (2015).
// doi: 10.1093/nar/gku1046
//
// Do not modify!!!!
window.wdePopulateEnzmes = wdePopulateEnzmes;
function wdePopulateEnzmes() {
    wdeEnzy[0]=["AatII","GACGT^C",0,"-",""];
    wdeEnzy[1]=["AccI","GT^MKAC",0,"-",""];
    wdeEnzy[2]=["Acc65I","G^GTACC",0,"-",""];
    wdeEnzy[3]=["AciI","CCGC(-3/-1)",0,"-",""];
    wdeEnzy[4]=["AclI","AA^CGTT",0,"-",""];
    wdeEnzy[5]=["AcuI","CTGAAG(16/14)",0,"-",""];
    wdeEnzy[6]=["AfeI","AGC^GCT",0,"-",""];
    wdeEnzy[7]=["AflII","C^TTAAG",0,"-",""];
    wdeEnzy[8]=["AflIII","A^CRYGT",0,"-",""];
    wdeEnzy[9]=["AgeI","A^CCGGT",0,"-",""];
    wdeEnzy[10]=["AhdI","GACNNN^NNGTC",0,"-",""];
    wdeEnzy[11]=["AleI","CACNN^NNGTG",0,"-",""];
    wdeEnzy[12]=["AluI","AG^CT",0,"-",""];
    wdeEnzy[13]=["AlwI","GGATC(4/5)",0,"-",""];
    wdeEnzy[14]=["AlwNI","CAGNNN^CTG",0,"-",""];
    wdeEnzy[15]=["ApaI","GGGCC^C",0,"-",""];
    wdeEnzy[16]=["ApaLI","G^TGCAC",0,"-",""];
    wdeEnzy[17]=["ApeKI","G^CWGC",0,"-",""];
    wdeEnzy[18]=["ApoI","R^AATTY",0,"-",""];
    wdeEnzy[19]=["AscI","GG^CGCGCC",0,"-",""];
    wdeEnzy[20]=["AseI","AT^TAAT",0,"-",""];
    wdeEnzy[21]=["AsiSI","GCGAT^CGC",0,"-",""];
    wdeEnzy[22]=["Asp700I","GAANN^NNTTC",0,"-",""];
    wdeEnzy[23]=["Asp718I","G^GTACC",0,"-",""];
    wdeEnzy[24]=["AvaI","C^YCGRG",0,"-",""];
    wdeEnzy[25]=["AvaII","G^GWCC",0,"-",""];
    wdeEnzy[26]=["AvrII","C^CTAGG",0,"-",""];
    wdeEnzy[27]=["BaeGI","GKGCM^C",0,"-",""];
    wdeEnzy[28]=["BamHI","G^GATCC",0,"-",""];
    wdeEnzy[29]=["BanI","G^GYRCC",0,"-",""];
    wdeEnzy[30]=["BanII","GRGCY^C",0,"-",""];
    wdeEnzy[31]=["BbrPI","CAC^GTG",0,"-",""];
    wdeEnzy[32]=["BbsI","GAAGAC(2/6)",0,"-",""];
    wdeEnzy[33]=["BbvI","GCAGC(8/12)",0,"-",""];
    wdeEnzy[34]=["BbvCI","CCTCAGC(-5/-2)",0,"-",""];
    wdeEnzy[35]=["BccI","CCATC(4/5)",0,"-",""];
    wdeEnzy[36]=["BceAI","ACGGC(12/14)",0,"-",""];
    wdeEnzy[37]=["BciVI","GTATCC(6/5)",0,"-",""];
    wdeEnzy[38]=["BclI","T^GATCA",0,"-",""];
    wdeEnzy[39]=["BcoDI","GTCTC(1/5)",0,"-",""];
    wdeEnzy[40]=["BfaI","C^TAG",0,"-",""];
    wdeEnzy[41]=["BfrI","C^TTAAG",0,"-",""];
    wdeEnzy[42]=["BfuAI","ACCTGC(4/8)",0,"-",""];
    wdeEnzy[43]=["BfuCI","^GATC",0,"-",""];
    wdeEnzy[44]=["BglI","GCCNNNN^NGGC",0,"-",""];
    wdeEnzy[45]=["BglII","A^GATCT",0,"-",""];
    wdeEnzy[46]=["BlnI","C^CTAGG",0,"-",""];
    wdeEnzy[47]=["BlpI","GC^TNAGC",0,"-",""];
    wdeEnzy[48]=["BmgBI","CACGTC(-3/-3)",0,"-",""];
    wdeEnzy[49]=["BmrI","ACTGGG(5/4)",0,"-",""];
    wdeEnzy[50]=["BmtI","GCTAG^C",0,"-",""];
    wdeEnzy[51]=["BpmI","CTGGAG(16/14)",0,"-",""];
    wdeEnzy[52]=["Bpu10I","CCTNAGC(-5/-2)",0,"-",""];
    wdeEnzy[53]=["BpuEI","CTTGAG(16/14)",0,"-",""];
    wdeEnzy[54]=["BsaI","GGTCTC(1/5)",0,"-",""];
    wdeEnzy[55]=["BsaAI","YAC^GTR",0,"-",""];
    wdeEnzy[56]=["BsaBI","GATNN^NNATC",0,"-",""];
    wdeEnzy[57]=["BsaHI","GR^CGYC",0,"-",""];
    wdeEnzy[58]=["BsaJI","C^CNNGG",0,"-",""];
    wdeEnzy[59]=["BsaWI","W^CCGGW",0,"-",""];
    wdeEnzy[60]=["BsaXI","(9/12)ACNNNNNCTCC(10/7)",0,"-",""];
    wdeEnzy[61]=["BseRI","GAGGAG(10/8)",0,"-",""];
    wdeEnzy[62]=["BseYI","CCCAGC(-5/-1)",0,"-",""];
    wdeEnzy[63]=["BsgI","GTGCAG(16/14)",0,"-",""];
    wdeEnzy[64]=["BsiEI","CGRY^CG",0,"-",""];
    wdeEnzy[65]=["BsiHKAI","GWGCW^C",0,"-",""];
    wdeEnzy[66]=["BsiWI","C^GTACG",0,"-",""];
    wdeEnzy[67]=["BslI","CCNNNNN^NNGG",0,"-",""];
    wdeEnzy[68]=["BsmI","GAATGC(1/-1)",0,"-",""];
    wdeEnzy[69]=["BsmAI","GTCTC(1/5)",0,"-",""];
    wdeEnzy[70]=["BsmBI","CGTCTC(1/5)",0,"-",""];
    wdeEnzy[71]=["BsmFI","GGGAC(10/14)",0,"-",""];
    wdeEnzy[72]=["BsoBI","C^YCGRG",0,"-",""];
    wdeEnzy[73]=["Bsp1286I","GDGCH^C",0,"-",""];
    wdeEnzy[74]=["BspCNI","CTCAG(9/7)",0,"-",""];
    wdeEnzy[75]=["BspDI","AT^CGAT",0,"-",""];
    wdeEnzy[76]=["BspEI","T^CCGGA",0,"-",""];
    wdeEnzy[77]=["BspHI","T^CATGA",0,"-",""];
    wdeEnzy[78]=["BspMI","ACCTGC(4/8)",0,"-",""];
    wdeEnzy[79]=["BspQI","GCTCTTC(1/4)",0,"-",""];
    wdeEnzy[80]=["BsrI","ACTGG(1/-1)",0,"-",""];
    wdeEnzy[81]=["BsrBI","CCGCTC(-3/-3)",0,"-",""];
    wdeEnzy[82]=["BsrDI","GCAATG(2/0)",0,"-",""];
    wdeEnzy[83]=["BsrFI","R^CCGGY",0,"-",""];
    wdeEnzy[84]=["BsrGI","T^GTACA",0,"-",""];
    wdeEnzy[85]=["BssHII","G^CGCGC",0,"-",""];
    wdeEnzy[86]=["BssSI","CACGAG(-5/-1)",0,"-",""];
    wdeEnzy[87]=["BstAPI","GCANNNN^NTGC",0,"-",""];
    wdeEnzy[88]=["BstBI","TT^CGAA",0,"-",""];
    wdeEnzy[89]=["BstEII","G^GTNACC",0,"-",""];
    wdeEnzy[90]=["BstNI","CC^WGG",0,"-",""];
    wdeEnzy[91]=["BstUI","CG^CG",0,"-",""];
    wdeEnzy[92]=["BstXI","CCANNNNN^NTGG",0,"-",""];
    wdeEnzy[93]=["BstYI","R^GATCY",0,"-",""];
    wdeEnzy[94]=["BstZ17I","GTA^TAC",0,"-",""];
    wdeEnzy[95]=["Bsu36I","CC^TNAGG",0,"-",""];
    wdeEnzy[96]=["BtgI","C^CRYGG",0,"-",""];
    wdeEnzy[97]=["BtgZI","GCGATG(10/14)",0,"-",""];
    wdeEnzy[98]=["BtsI","GCAGTG(2/0)",0,"-",""];
    wdeEnzy[99]=["BtsIMutI","CAGTG(2/0)",0,"-",""];
    wdeEnzy[100]=["BtsCI","GGATG(2/0)",0,"-",""];
    wdeEnzy[101]=["Cac8I","GCN^NGC",0,"-",""];
    wdeEnzy[102]=["CfoI","GCG^C",0,"-",""];
    wdeEnzy[103]=["ClaI","AT^CGAT",0,"-",""];
    wdeEnzy[104]=["CviAII","C^ATG",0,"-",""];
    wdeEnzy[105]=["CviQI","G^TAC",0,"-",""];
    wdeEnzy[106]=["DdeI","C^TNAG",0,"-",""];
    wdeEnzy[107]=["DpnI","GA^TC",0,"-",""];
    wdeEnzy[108]=["DpnII","^GATC",0,"-",""];
    wdeEnzy[109]=["DraI","TTT^AAA",0,"-",""];
    wdeEnzy[110]=["DraIII","CACNNN^GTG",0,"-",""];
    wdeEnzy[111]=["DrdI","GACNNNN^NNGTC",0,"-",""];
    wdeEnzy[112]=["EaeI","Y^GGCCR",0,"-",""];
    wdeEnzy[113]=["EagI","C^GGCCG",0,"-",""];
    wdeEnzy[114]=["EarI","CTCTTC(1/4)",0,"-",""];
    wdeEnzy[115]=["EciI","GGCGGA(11/9)",0,"-",""];
    wdeEnzy[116]=["Eco47III","AGC^GCT",0,"-",""];
    wdeEnzy[117]=["EcoNI","CCTNN^NNNAGG",0,"-",""];
    wdeEnzy[118]=["EcoO109I","RG^GNCCY",0,"-",""];
    wdeEnzy[119]=["EcoP15I","CAGCAG(25/27)",0,"-",""];
    wdeEnzy[120]=["EcoRI","G^AATTC",0,"-",""];
    wdeEnzy[121]=["EcoRV","GAT^ATC",0,"-",""];
    wdeEnzy[122]=["Eco53kI","GAG^CTC",0,"-",""];
    wdeEnzy[123]=["FatI","^CATG",0,"-",""];
    wdeEnzy[124]=["FauI","CCCGC(4/6)",0,"-",""];
    wdeEnzy[125]=["Fnu4HI","GC^NGC",0,"-",""];
    wdeEnzy[126]=["FokI","GGATG(9/13)",0,"-",""];
    wdeEnzy[127]=["FseI","GGCCGG^CC",0,"-",""];
    wdeEnzy[128]=["FspI","TGC^GCA",0,"-",""];
    wdeEnzy[129]=["HaeII","RGCGC^Y",0,"-",""];
    wdeEnzy[130]=["HaeIII","GG^CC",0,"-",""];
    wdeEnzy[131]=["HgaI","GACGC(5/10)",0,"-",""];
    wdeEnzy[132]=["HhaI","GCG^C",0,"-",""];
    wdeEnzy[133]=["HinP1I","G^CGC",0,"-",""];
    wdeEnzy[134]=["HincII","GTY^RAC",0,"-",""];
    wdeEnzy[135]=["HindII","GTY^RAC",0,"-",""];
    wdeEnzy[136]=["HindIII","A^AGCTT",0,"-",""];
    wdeEnzy[137]=["HinfI","G^ANTC",0,"-",""];
    wdeEnzy[138]=["HpaI","GTT^AAC",0,"-",""];
    wdeEnzy[139]=["HpaII","C^CGG",0,"-",""];
    wdeEnzy[140]=["HphI","GGTGA(8/7)",0,"-",""];
    wdeEnzy[141]=["Hpy99I","CGWCG^",0,"-",""];
    wdeEnzy[142]=["Hpy166II","GTN^NAC",0,"-",""];
    wdeEnzy[143]=["Hpy188I","TCN^GA",0,"-",""];
    wdeEnzy[144]=["Hpy188III","TC^NNGA",0,"-",""];
    wdeEnzy[145]=["HpyAV","CCTTC(6/5)",0,"-",""];
    wdeEnzy[146]=["HpyCH4III","ACN^GT",0,"-",""];
    wdeEnzy[147]=["HpyCH4IV","A^CGT",0,"-",""];
    wdeEnzy[148]=["HpyCH4V","TG^CA",0,"-",""];
    wdeEnzy[149]=["KasI","G^GCGCC",0,"-",""];
    wdeEnzy[150]=["KpnI","GGTAC^C",0,"-",""];
    wdeEnzy[151]=["KspI","CCGC^GG",0,"-",""];
    wdeEnzy[152]=["MaeI","C^TAG",0,"-",""];
    wdeEnzy[153]=["MaeII","A^CGT",0,"-",""];
    wdeEnzy[154]=["MaeIII","^GTNAC",0,"-",""];
    wdeEnzy[155]=["MboI","^GATC",0,"-",""];
    wdeEnzy[156]=["MboII","GAAGA(8/7)",0,"-",""];
    wdeEnzy[157]=["MfeI","C^AATTG",0,"-",""];
    wdeEnzy[158]=["MluI","A^CGCGT",0,"-",""];
    wdeEnzy[159]=["MluCI","^AATT",0,"-",""];
    wdeEnzy[160]=["MluNI","TGG^CCA",0,"-",""];
    wdeEnzy[161]=["MlyI","GAGTC(5/5)",0,"-",""];
    wdeEnzy[162]=["MmeI","TCCRAC(20/18)",0,"-",""];
    wdeEnzy[163]=["MnlI","CCTC(7/6)",0,"-",""];
    wdeEnzy[164]=["MroI","T^CCGGA",0,"-",""];
    wdeEnzy[165]=["MscI","TGG^CCA",0,"-",""];
    wdeEnzy[166]=["MseI","T^TAA",0,"-",""];
    wdeEnzy[167]=["MslI","CAYNN^NNRTG",0,"-",""];
    wdeEnzy[168]=["MspI","C^CGG",0,"-",""];
    wdeEnzy[169]=["MspA1I","CMG^CKG",0,"-",""];
    wdeEnzy[170]=["MunI","C^AATTG",0,"-",""];
    wdeEnzy[171]=["MvaI","CC^WGG",0,"-",""];
    wdeEnzy[172]=["MvnI","CG^CG",0,"-",""];
    wdeEnzy[173]=["MwoI","GCNNNNN^NNGC",0,"-",""];
    wdeEnzy[174]=["NaeI","GCC^GGC",0,"-",""];
    wdeEnzy[175]=["NarI","GG^CGCC",0,"-",""];
    wdeEnzy[176]=["NciI","CC^SGG",0,"-",""];
    wdeEnzy[177]=["NcoI","C^CATGG",0,"-",""];
    wdeEnzy[178]=["NdeI","CA^TATG",0,"-",""];
    wdeEnzy[179]=["NdeII","^GATC",0,"-",""];
    wdeEnzy[180]=["NgoMIV","G^CCGGC",0,"-",""];
    wdeEnzy[181]=["NheI","G^CTAGC",0,"-",""];
    wdeEnzy[182]=["NlaIII","CATG^",0,"-",""];
    wdeEnzy[183]=["NlaIV","GGN^NCC",0,"-",""];
    wdeEnzy[184]=["NmeAIII","GCCGAG(21/19)",0,"-",""];
    wdeEnzy[185]=["NotI","GC^GGCCGC",0,"-",""];
    wdeEnzy[186]=["NruI","TCG^CGA",0,"-",""];
    wdeEnzy[187]=["NsiI","ATGCA^T",0,"-",""];
    wdeEnzy[188]=["NspI","RCATG^Y",0,"-",""];
    wdeEnzy[189]=["PacI","TTAAT^TAA",0,"-",""];
    wdeEnzy[190]=["PaeR7I","C^TCGAG",0,"-",""];
    wdeEnzy[191]=["PciI","A^CATGT",0,"-",""];
    wdeEnzy[192]=["PflFI","GACN^NNGTC",0,"-",""];
    wdeEnzy[193]=["PflMI","CCANNNN^NTGG",0,"-",""];
    wdeEnzy[194]=["PleI","GAGTC(4/5)",0,"-",""];
    wdeEnzy[195]=["PluTI","GGCGC^C",0,"-",""];
    wdeEnzy[196]=["PmeI","GTTT^AAAC",0,"-",""];
    wdeEnzy[197]=["PmlI","CAC^GTG",0,"-",""];
    wdeEnzy[198]=["PpuMI","RG^GWCCY",0,"-",""];
    wdeEnzy[199]=["PshAI","GACNN^NNGTC",0,"-",""];
    wdeEnzy[200]=["PsiI","TTA^TAA",0,"-",""];
    wdeEnzy[201]=["PspGI","^CCWGG",0,"-",""];
    wdeEnzy[202]=["PspOMI","G^GGCCC",0,"-",""];
    wdeEnzy[203]=["PspXI","VC^TCGAGB",0,"-",""];
    wdeEnzy[204]=["PstI","CTGCA^G",0,"-",""];
    wdeEnzy[205]=["PvuI","CGAT^CG",0,"-",""];
    wdeEnzy[206]=["PvuII","CAG^CTG",0,"-",""];
    wdeEnzy[207]=["RsaI","GT^AC",0,"-",""];
    wdeEnzy[208]=["RsrII","CG^GWCCG",0,"-",""];
    wdeEnzy[209]=["SacI","GAGCT^C",0,"-",""];
    wdeEnzy[210]=["SacII","CCGC^GG",0,"-",""];
    wdeEnzy[211]=["SalI","G^TCGAC",0,"-",""];
    wdeEnzy[212]=["SapI","GCTCTTC(1/4)",0,"-",""];
    wdeEnzy[213]=["Sau96I","G^GNCC",0,"-",""];
    wdeEnzy[214]=["Sau3AI","^GATC",0,"-",""];
    wdeEnzy[215]=["SbfI","CCTGCA^GG",0,"-",""];
    wdeEnzy[216]=["ScaI","AGT^ACT",0,"-",""];
    wdeEnzy[217]=["ScrFI","CC^NGG",0,"-",""];
    wdeEnzy[218]=["SexAI","A^CCWGGT",0,"-",""];
    wdeEnzy[219]=["SfaNI","GCATC(5/9)",0,"-",""];
    wdeEnzy[220]=["SfcI","C^TRYAG",0,"-",""];
    wdeEnzy[221]=["SfoI","GGC^GCC",0,"-",""];
    wdeEnzy[222]=["SfuI","TT^CGAA",0,"-",""];
    wdeEnzy[223]=["SgrAI","CR^CCGGYG",0,"-",""];
    wdeEnzy[224]=["SmaI","CCC^GGG",0,"-",""];
    wdeEnzy[225]=["SmlI","C^TYRAG",0,"-",""];
    wdeEnzy[226]=["SnaBI","TAC^GTA",0,"-",""];
    wdeEnzy[227]=["SpeI","A^CTAGT",0,"-",""];
    wdeEnzy[228]=["SphI","GCATG^C",0,"-",""];
    wdeEnzy[229]=["SrfI","GCCC^GGGC",0,"-",""];
    wdeEnzy[230]=["SspI","AAT^ATT",0,"-",""];
    wdeEnzy[231]=["StuI","AGG^CCT",0,"-",""];
    wdeEnzy[232]=["StyI","C^CWWGG",0,"-",""];
    wdeEnzy[233]=["StyD4I","^CCNGG",0,"-",""];
    wdeEnzy[234]=["SwaI","ATTT^AAAT",0,"-",""];
    wdeEnzy[235]=["TaqI","T^CGA",0,"-",""];
    wdeEnzy[236]=["TfiI","G^AWTC",0,"-",""];
    wdeEnzy[237]=["Tru9I","T^TAA",0,"-",""];
    wdeEnzy[238]=["TseI","G^CWGC",0,"-",""];
    wdeEnzy[239]=["Tsp45I","^GTSAC",0,"-",""];
    wdeEnzy[240]=["TspMI","C^CCGGG",0,"-",""];
    wdeEnzy[241]=["TspRI","CASTGNN^",0,"-",""];
    wdeEnzy[242]=["Tth111I","GACN^NNGTC",0,"-",""];
    wdeEnzy[243]=["XbaI","T^CTAGA",0,"-",""];
    wdeEnzy[244]=["XhoI","C^TCGAG",0,"-",""];
    wdeEnzy[245]=["XmaI","C^CCGGG",0,"-",""];
    wdeEnzy[246]=["XmnI","GAANN^NNTTC",0,"-",""];
    wdeEnzy[247]=["ZraI","GAC^GTC",0,"-",""];
    wdeSetDamDcmMeth();
}

