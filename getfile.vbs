Set Shell = CreateObject("Shell.Application")
hwnd = CInt(WSH.Arguments(0))

For Each win In Shell.Windows
	If Not(hwnd) Or win.HWND Then
		For Each selected In win.Document.SelectedItems
			WSH.Echo(gbk2utf8(selected.Path))
			WSH.quit
		Next
	End If
Next
WSH.Echo("NNNNN")


Function gbk2utf8(msg)
for i=1 to len(msg)
    Bin=mid(msg,i,1)
    If RegExpTest("[\u1e00-\uffef]", Bin) Then
    
            wscript.echo UTF2GB(Bin) & "--HZ"

        instru_msg=instru_msg & conv(Bin)
    else
        instru_msg=instru_msg & Bin
    end if
next
gbk2utf8=instru_msg
End Function

 
Function conv(strIn)
    Set adoStream = CreateObject("ADODB.Stream")
    adoStream.Charset = "utf-8"
    adoStream.Type = 2 'adTypeText
    adoStream.Open 
    adoStream.WriteText strIn
    adoStream.Position = 0 
    ' adoStream.Charset = "gb2312" 
    adoStream.Type = 2 'adTypeBinary 
    conv = adoStream.ReadText() 
    adoStream.Close 
       
'   conv = Mid(conv, 1) 
End Function
Function RegExpTest(patrn, strng)  
    Dim regEx, retVal ' 建立变量。  
    Set regEx = New RegExp ' 建立正则表达式。  
    regEx.Pattern = patrn ' 设置模式。  
    regEx.IgnoreCase = False ' 设置是否区分大小写。  
    retVal = regEx.Test(strng) ' 执行搜索测试。  
    If retVal Then  
        RegExpTest = True 
    Else  
        RegExpTest = False 
    End If  
End Function

function UTF2GB(UTFStr)
for Dig=1 to len(UTFStr)
  '如果UTF8编码文字以%开头则进行转换
  if mid(UTFStr,Dig,1)="%" then
     'UTF8编码文字大于8则转换为汉字
    if len(UTFStr) >= Dig+8 then
       GBStr=GBStr & ConvChinese(mid(UTFStr,Dig,9))
       Dig=Dig+8
    else
      GBStr=GBStr & mid(UTFStr,Dig,1)
    end if
  else
     GBStr=GBStr & mid(UTFStr,Dig,1)
  end if
next
UTF2GB=GBStr
end function
