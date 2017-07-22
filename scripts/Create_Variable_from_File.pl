#!/usr/local/bin/perl -w

use strict;
use warnings;

my $file = "seq.gb";
my $output = "var_output.txt";
my $fileContent;

open (OUTFILE, ">$output") or print "Error opening $output for writing";
open (INFILE, "<$file") or print "Error opening $file for reading";

while (<INFILE>) {
	$fileContent .= $_;
}
close(INFILE);

my @arr = split("\n", $fileContent);

my $outFil = "";

$outFil .= "    var varName = \"\" +\n";

foreach (@arr) {
	my $line = $_;
	$line =~ s/\"/\\\"/g;
    $outFil .= "    \"$line\\n\" +\n";
}

$outFil =~ s/varName = \"\" \+\n    \"/varName = \"/g;
$outFil =~ s/\" \+\n$/\";\n\n/g;


print OUTFILE $outFil;
close(OUTFILE);

print "\nDone!!\n";

exit 0;


