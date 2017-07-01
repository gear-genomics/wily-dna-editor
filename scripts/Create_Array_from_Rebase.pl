#!/usr/local/bin/perl -w

use strict;
use warnings;

my $file = "allenz.txt";
my $output = "array_temp.txt";
my $fileContent;

open (OUTFILE, ">$output") or print "Error opening $output for writing";
open (INFILE, "<$file") or print "Error opening $file for reading";

while (<INFILE>) {
	$fileContent .= $_;
}
close(INFILE);

my @arr = split("\n", $fileContent);

my $name = "";
my $seq = "";
my $seqLength = "";
my $comm = "";
my $enzCount = 0;
my $doNotAdd = 0;


print OUTFILE "function wdePopulateEnzmes() {\n";

foreach (@arr) {
	if ($_ =~ /^<[0-9]>/) {
		
		
		if ($_ =~ /^<1>/) {
			$name = $_;
			$name =~ s/^<1>//g;
			# This enzymes mess up the table and are not a real bonus:
			if ($name eq "CspCI" || $name eq "BaeI" || $name eq "BcgI" || $name eq "XcmI" || $name eq "SfiI") {
				print "--$name--\n";
				$doNotAdd = 1;
			} else {
				$doNotAdd = 0;
			}		
		}
		if ($_ =~ /^<5>/) {
			$seq = $_;
			$seq =~ s/^<5>//g;
			$seqLength = $seq;
			$seqLength =~ s/[^ATGCatgc]//g;
		}
		if ($_ =~ /^<7>/) {
			$comm = $_;
			$comm =~ s/^<7>//g;
			# Select Enzymes from 
			#   Roche Applied Science (M) 
			#   New England Biolabs (N)
			# IMPORTANT: Have to be marked additionally for Dam/Dcm methylation sensitivity in function code!!!
			if (($comm =~ /[MN]/) and (length $seqLength > 3) and ($doNotAdd == 0)) {
				# Array structure:
                # Enzyme name, Enzyme Sequence, Selected, Number of occurences in sequence, Positions
				print OUTFILE "    wdeEnzy[$enzCount]=[\"$name\",\"$seq\",0,\"-\",\"\"];\n";
				$enzCount++;
			}
			
			
		}
	}
	

}

print OUTFILE "    wdeSetDamDcmMeth();\n}\n\n";



close(OUTFILE);

print "\nFound $enzCount Enzymes.\nDone!!\n";

exit 0;


