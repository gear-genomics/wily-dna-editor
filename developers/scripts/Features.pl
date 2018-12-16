#!/usr/local/bin/perl -w

use strict;
use warnings;

my $file = "features_def.txt";
my $output = "array_features.txt";
my $fileContent;

open (OUTFILE, ">$output") or print "Error opening $output for writing";
open (INFILE, "<$file") or print "Error opening $file for reading";

while (<INFILE>) {
	$fileContent .= $_;
}
close(INFILE);

my @arr = split("\n", $fileContent);

my $name = "";


print OUTFILE "Key\tForwardColor\tReverseColor\tShape\n";

foreach (@arr) {
	if ($_ =~ /^Feature Key/) {
		$name = $_;
		$name =~ s/^Feature Key +//g;
		print OUTFILE "$name\t\t\t\n";
	}
	

}

close(OUTFILE);

print "\nDone!!\n";

exit 0;


