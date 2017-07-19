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

print OUTFILE "}\n\n";


close(OUTFILE);

print "\nDone!!\n";

exit 0;


