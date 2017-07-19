#!/usr/local/bin/perl -w

use strict;
use warnings;

my $file = "array_features_curated.txt";
my $output = "array_features.txt";
my $fileContent;

open (OUTFILE, ">$output") or print "Error opening $output for writing";
open (INFILE, "<$file") or print "Error opening $file for reading";

while (<INFILE>) {
	$fileContent .= $_;
}
close(INFILE);

my @arr = split("\n", $fileContent);

my $reg = qq{
Promotor:
"minus_35_signal"	#e6ac00	#e6ac00	box
"minus_10_signal"	#e6ac00	#e6ac00	box
"TATA_box"	#e6ac00	#e6ac00	box
"GC_signal"	#e6ac00	#e6ac00	box
"CAAT_signal"	#e6ac00	#e6ac00	box
"promoter"	#ffd24d	#ffd24d	arrow
"ribosome_binding_site"	#e6ac00	#e6ac00	box
"riboswitch"	#e6ac00	#e6ac00	box

End:
"attenuator"	#e6e600	#e6e600	box
"terminator"	#ffff33	#ffff33	arrow
"polyA_signal_sequence"	#e6e600	#e6e600	box

Other:
"DNase_I_hypersensitive_site"	#ffb84d	#ffb84d	box
"enhancer"	#ffb84d	#ffb84d	box
"enhancer_blocking_element"	#ffb84d	#ffb84d	box
"imprinting_control_region"	#ffb84d	#ffb84d	box
"insulator"	#ffb84d	#ffb84d	box
"locus_control_region"	#ffb84d	#ffb84d	box
"matrix_attachment_region"	#ffb84d	#ffb84d	box
"recoding_stimulatory_region"	#ffb84d	#ffb84d	box
"replication_regulatory_region"	#ffb84d	#ffb84d	box
"response_element"	#ffb84d	#ffb84d	box
"silencer"	#ffb84d	#ffb84d	box
"transcriptional_cis_regulatory_region"	#ffb84d	#ffb84d	box
"other"	#ffb84d	#ffb84d	box
};

my @arr2 = split("\n", $reg);

print OUTFILE "function wdePopulateFeatureColors() {\n";

my $i = -1;

foreach (@arr) {
	my @cur = split("\t" , $_);
	if ($#cur != 3) {
		print "Error: $_\n";
	} else {
		if ($i > -1) {
   			print OUTFILE "    wdeFeatColor[$i]=[\"$cur[0]\",\"$cur[1]\",\"$cur[2]\",\"$cur[3]\"];\n";
		}
   		$i++;
	}
		
}

print OUTFILE "    wdePopulateFeatRegColors();\n}\n\n";

print OUTFILE "function wdePopulateFeatRegColors() {\n";

$i = -1;

foreach (@arr2) {
	my @cur = split("\t" , $_);
	if ($#cur != 3) {
		print "No add: $_\n";
	} else {
		if ($i > -1) {
   			print OUTFILE "    wdeFeatRegColor[$i]=[$cur[0],\"$cur[1]\",\"$cur[2]\",\"$cur[3]\"];\n";
		}
   		$i++;
	}
		
}

print OUTFILE "}\n\n";

close(OUTFILE);

print "\nDone!!\n";

exit 0;


