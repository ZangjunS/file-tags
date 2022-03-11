var Shell = new ActiveXObject("Shell.Application")
var win = new Enumerator(Shell.Windows())

while (!win.atEnd()) {
    var selected = new Enumerator(win.item().Document.SelectedItems())
    while (!selected.atEnd()) {
        WSH.Echo(string2CharCodeArray(selected.item().Path))
        WSH.quit()
        selected.moveNext()
    }
    win.moveNext()
}
WSH.Echo("NNNNN");

function string2CharCodeArray(str) {
    var arr = [];
    for (var i = 0, j = str.length; i < j; ++i) {
        // WSH.Echo(str[i]);
        // WSH.Echo(str.charCodeAt(i));
        arr.push(str.charCodeAt(i));
    }
    // var tmpUint8Array = new Uint8Array(arr);
    return arr
}