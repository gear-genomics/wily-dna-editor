#!/usr/local/bin/perl -w

use strict;
use warnings;

my $file = "gc.prt";
my $output = "array_trans.txt";
my $fileContent;

open (OUTFILE, ">$output") or print "Error opening $output for writing";
open (INFILE, "<$file") or print "Error opening $file for reading";

while (<INFILE>) {
	$fileContent .= $_;
}
close(INFILE);

my @arr = split("\n", $fileContent);

my $name = "";
my $trans = "";
my $start = "";
my $i = 0;

my $def = qq{    wdeTranslate[0]=[
      "Standard  -  only Met Start",
      "FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG",
      "-----------------------------------M----------------------------"];
};

print OUTFILE "function wdePopulateTranslation() {\n$def";

foreach (@arr) {
	if ($_ =~ /^ /) {
		if ($_ =~ /^ \{/) {
			$i++;
			$name = "";
			$trans = "";
            $start = "";
		}
		if ($_ =~ /^  name/) {
			my @nam = split("\"", $_);
			if ( $name eq "") {
				$name = $nam[1];
			}
		}
		if ($_ =~ /^  ncbieaa/) {
			my @nam = split("\"", $_);
			$trans = $nam[1];
		}
		if ($_ =~ /^  sncbieaa/) {
			my @nam = split("\"", $_);
			$start = $nam[1];
		}
		
		if ($_ =~ /^ \}/) {
			print OUTFILE "    wdeTranslate[$i]=[\n      \"$name\",\n      \"$trans\",\n      \"$start\"];\n";
			$name = "";
			$trans = "";
            $start = "";
		}
		# Just to be save:
		if ($_ =~ /Base1/) {
			if ( $_ ne "  -- Base1  TTTTTTTTTTTTTTTTCCCCCCCCCCCCCCCCAAAAAAAAAAAAAAAAGGGGGGGGGGGGGGGG") {
				print "Alert: $name Base 1 Error\n";
			}
		}
		if ($_ =~ /Base2/) {
			if ( $_ ne "  -- Base2  TTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGG") {
				print "Alert: $name Base 1 Error\n";
			}
		}
		if ($_ =~ /Base3/) {
			if ( $_ ne "  -- Base3  TCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAG") {
				print "Alert: $name Base 1 Error\n";
			}
		}
	}
}

print OUTFILE "    \n}\n\n";



close(OUTFILE);

print "\nDone!!\n";

exit 0;


