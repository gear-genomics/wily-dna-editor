use strict;
use warnings;

if ($#ARGV != 1) {
        print "Missing command line parameters:\nchangeFooter sourceFile.html targetFile.html\n";
        exit 0;
}

my $file = $ARGV[0];
my $output = $ARGV[1];

my $fileContent = "";

my $newFooter = qq{<div id="WDE_footer">
<a>&copy; by A. Untergasser</a>
&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;
<a href="http://XXX/contact_e.html">Contact</a>
</div>
};

open (OUTFILE, ">$output") or print "Error opening $output for writing";
open (INFILE, "<$file") or print "Error opening $file for reading";

while (<INFILE>) {
    $fileContent .= $_;
}

my @arr = split("\n", $fileContent);

foreach (@arr) {
    if ($_ =~ /^<div id="WDE_footer">/) {
        print OUTFILE $newFooter;
    } else {
        print OUTFILE "$_\n" ;
    }
}
close(INFILE);
close(OUTFILE);

exit 0;
