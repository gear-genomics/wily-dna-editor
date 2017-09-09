#!/usr/bin/perl -w

# Copyright (c) 2017
# Andreas Untergasser. All rights reserved.
#
#    This file is part of the the Wily DNA Editor suite and libraries.
#
#    The the Wily DNA Editor suite and libraries are free software;
#    you can redistribute them and/or modify them under the terms
#    of the GNU General Public License as published by the Free
#    Software Foundation; either version 2 of the License, or (at
#    your option) any later version.
#
#    This software is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU General Public License for more details.
#
#    You should have received a copy of the GNU General Public License
#    along with this software (file gpl-2.0.txt in the source
#    distribution); if not, write to the Free Software
#    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
# "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
# LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
# A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
# OWNERS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
# SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
# LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
# DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
# THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
# (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
# OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

use strict;
use File::Copy;

my $completeFileName = "./statistics_files/wilydnaeditor_main.txt";
my $completeTmpFileName = "./statistics_files/TMP_wilydnaeditor_main.txt";

my $fileInAString;
my $processedDate;
my $processedCount;
my $compressedFile;
my $line;
my $date;
my $dateCout = 0;
my $oldLine = "...";
my @rawDates;
my %dates;

# Get the current date
my ($second,     $minute,    $hour,
    $dayOfMonth, $month,     $yearOffset,
    $dayOfWeek,  $dayOfYear, $daylightSavings );
(   $second,     $minute,    $hour,
    $dayOfMonth, $month,     $yearOffset,
    $dayOfWeek,  $dayOfYear, $daylightSavings ) = localtime();
my $year = 1900 + $yearOffset;
$month++;

my $today = sprintf "%04d.%02d.%02d", $year, $month, $dayOfMonth;

open( TEMPLATEFILE, "<$completeFileName" ) or die print "cant open file";
binmode TEMPLATEFILE;
my $data;
while ( read TEMPLATEFILE, $data, 1024 ) {
    $fileInAString .= $data;
}
close(TEMPLATEFILE);
    
@rawDates = split '\n', $fileInAString;
foreach $line (@rawDates) {
    $line =~ s/\s//g;
    if ($line =~ /\d/ ) {
        $date = $line;
        if ($line =~ /=/ ) {
            if ($oldLine ne "...") {
                # There was a compressed date before and now there is a new
                # So save the last date info
                $compressedFile .= $oldLine ."=". $dateCout . "\n";
            }
            # Process and load the curent date
            ($processedDate, $processedCount) = split '=', $line;
            $dates{$processedDate} = $processedCount;
            $oldLine = $processedDate;
            $dateCout = $processedCount;
        } elsif ($line eq $oldLine) {
            # Unprocessed date, but date existed before
            $dateCout++;
        } elsif ($oldLine eq "...") {
            # Very first unprocessed date
            $dateCout = 1;
            $oldLine = $line;
        }else {
            # New date, save the old and set new to one
            $dates{$oldLine} = $dateCout;
            $compressedFile .= $oldLine ."=". $dateCout . "\n";
            $dateCout = 1;
            $oldLine = $line;
        }
    }
}
$dates{$oldLine} = $dateCout;
$compressedFile .= $oldLine ."=". $dateCout . "\n";

my $continue = 1;

open( TEMPLATEFILE, ">$completeTmpFileName" ) or $continue = 0;
if ($continue == 1) { 
    print TEMPLATEFILE $compressedFile;
    close(TEMPLATEFILE);

    copy($completeTmpFileName,$completeFileName);
}

# Collect all the dates and the Month usage:
my $theKey;
my $monthKey;
my %startUpsMonth;
my %allDates;
my %allMonth;
my $startUpsVal;

foreach $theKey (keys(%dates)) {
    $allDates{$theKey} = 1;
    # Add to the month
    $monthKey = $theKey;
    $monthKey =~ s/\.\d+$// ;
    if (defined $startUpsMonth{$monthKey}) {
        $startUpsMonth{$monthKey} += $dates{$theKey};
    } else {
        $startUpsMonth{$monthKey} = $dates{$theKey};
        $allMonth{$monthKey} = 1;
    }
}

# Now create the html to return

my $formHTML = qq{<!DOCTYPE html>
<html>
<head>
  <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
  <meta name="viewport" content="width=1034px, initial-scale=1.0">
  <title>The Wily DNA Editor</title>
  <style type="text/css">
    body {
        color: black;
        background-color: white;
        font-size: 100.01%;
        margin: 1em;
        padding: 0;
        text-align: center
    }

    div#page { text-align: left;
        margin: auto;
        width: 1024px;
    }

    div#WDE_no_javascript {
        width:900px;
        border: 2px solid #ccccff;
        margin: 4px 0px 0px 0px;
        clear: left;
        float: left;
        background-color: rgb(255, 0, 0);
        overflow:hidden;
        padding: 0px;
    }

    .WDE_tab_page {
        width:900px;
        border: 2px solid #ccccff;
        clear: left;
        float: left;
        background-color: rgb(255, 255, 230);
        overflow:hidden;
        padding: 0px;
        line-height: 1.2;
    }

	div#WDE_footer {
		margin: 12px 0px 3px 0px;
		font-size: 80%;
		font-family: Arial;
		font-weight: bold;
		color: rgb(75, 75, 75);
		text-align: center;
	}
	
    div#WDE_space {
        padding: 8px;
        line-height: 2;
    }

    div#WDE_enzymes_spacer{
        font-size: 80%;
        line-height: 1.5;
    }

    .WDE_tab_page_no_border {
        width:900px;
        clear: left;
        float: left;
        background-color: rgb(255, 255, 230);
        overflow:hidden;
    }
    
    div#WDEonlyTab {
        width:900px;
        border: 2px solid #ccccff;
        margin: 4px 0px 0px 0px;
        clear: left;
        float: left;
        background-color: rgb(255, 255, 230);
        overflow:hidden;
        padding: 0px;
    }

    div#menuBar { float:left; width:900px; padding: 0px; margin: 8px 0 0 8px; line-height:normal; text-align: left; }
    div#menuBar ul { margin:0px; padding: 0px; list-style:none; }
    div#menuBar li { float:left; margin:0; border: 2px solid #ccccff; border-bottom-width: 0; }
    div#menuBar a { top: 2px; display:block; padding: 0.24em 1em; font-weight: bold; cursor: pointer; }

    div#WDE_top_bar { width: 900px; padding: 0px; border: 2px solid #ccccff;}
    .WDE_background { background-color:#ccccff; }
    .WDE_top_bar_table { border:0; width:100%; }
    .WDE_top_bar_cell { border:0; padding:0.4em;background-color:#ccccff; }
    .WDE_top_bar_title { font-size: 2.2em; font-weight:700; }
    .WDE_top_bar_explain { font-size: 1.0em; font-weight:500 }
    .WDE_top_bar_link { font-weight:bold }
    .WDE_table_no_border { border:0; width:100%; empty-cells:show; }
    .WDE_note { background-color:rgb(255,120,60); padding:0px; }
    .WDE_table_with_border { border:1px solid #000; width:100%; empty-cells:show; border-collapse:collapse; }

    textarea#sequenceTextarea { font-family:Courier,monospace; width:95%; }
  </style>
</head>


<body>

<div id="page">

<div id="WDE_complete">

<div id="WDE_top_bar">
   <table class="WDE_top_bar_table">
     <colgroup>
       <col width="60%" class="WDE_background">
       <col width="20%" class="WDE_background">
       <col width="20%" class="WDE_background">
     </colgroup>
     <tr>
       <td class="WDE_top_bar_cell" rowspan="2"><a class="WDE_top_bar_title">The Wily DNA Editor</a><br>
       <a class="WDE_top_bar_explain" id="top">master DNA sequences, plasmids and restriction enzyme digests</a>
       </td>
       <td class="WDE_top_bar_cell"><a class="WDE_top_bar_link" href="https://wily-dna-editor.com/more.html">More...</a>
       </td>
       <td class="WDE_top_bar_cell"><a class="WDE_top_bar_link" href="https://sourceforge.net/projects/the-wily-dna-editor/">Source Code</a>
       </td>
     </tr>
     <tr>
       <td class="WDE_top_bar_cell"><a class="WDE_top_bar_link" href="https://wily-dna-editor.com/index.html">Main</a>
       </td>
       <td class="WDE_top_bar_cell"><a class="WDE_top_bar_link" href="https://wily-dna-editor.com/about.html">About</a>
       </td>
     </tr>
   </table>
</div>

<div id="WDEonlyTab">
<div id="WDE_space">

<h2>The Wily DNA Editor Usage Statistics</h2>

<h2>Usage per month:</h2>
  <table class="WDE_table_with_border">
     <colgroup>
       <col width="20%">
       <col width="20%">
       <col width="60%">
     </colgroup>
     <tr>
       <td><strong>Date</strong></td>
       <td><strong>WDE Page Views</strong></td>
       <td></td>
     </tr>
};

  foreach $theKey (reverse sort(keys(%allMonth))) {
      if (defined $startUpsMonth{$theKey}) {
          $startUpsVal = $startUpsMonth{$theKey};
      } else {
          $startUpsVal = "---";
      }
      $theKey =~ s/\./-/g;
      $formHTML .= qq{    <tr>
       <td>$theKey</td>
       <td>$startUpsVal</td>
       <td></td>
     </tr>
};
  }

$formHTML .= qq{
  </table>
<h2>Usage per day:</h2>
  <table class="WDE_table_with_border">
     <colgroup>
       <col width="20%">
       <col width="20%">
       <col width="60%">
     </colgroup>
     <tr>
       <td><strong>Date</strong></td>
       <td><strong>WDE Page Views</strong></td>
       <td></td>
     </tr>
};

  foreach $theKey (reverse sort(keys(%allDates))) {
      if (defined $dates{$theKey}) {
          $startUpsVal = $dates{$theKey};
      } else {
          $startUpsVal = "---";
      }
      $theKey =~ s/\./-/g;
      $formHTML .= qq{    <tr>
       <td>$theKey</td>
       <td>$startUpsVal</td>
       <td></td>
     </tr>
};
  }

$formHTML .= qq{
  </table></div>
<div id="WDE_footer"><a>&copy; by A. Untergasser</a></div>

</div>
</div>

</div>

</body>
</html>

};

print "Content-type: text/html\n\n$formHTML\n";



