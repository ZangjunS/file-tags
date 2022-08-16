var Shell = new ActiveXObject("Shell.Application")
var win = new Enumerator(Shell.Windows())
var res = "";

var Wrap = new ActiveXObject("DynamicWrapperX")
Wrap.Register("USER32.DLL", "GetForegroundWindow", "f=s", "r=l")
// WSH.Echo(Wrap.GetForegroundWindow())

while (!win.atEnd()) {
    if (Wrap.GetForegroundWindow() == win.item().HWND) {
        var selected = new Enumerator(win.item().Document.SelectedItems())
        while (!selected.atEnd()) {
            WSH.Echo(
                //selected.item().Path)
                string2CharCodeArray(selected.item().Path))
            WSH.quit()
            selected.moveNext()
        }
        // WSH.Echo(win.item().HWND)
    }
    win.moveNext()
}
WSH.Echo(string2CharCodeArray("NNNNN"));
// WSH.Echo(string2CharCodeArray(res));


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