# dairy

```
Option Explicit

' ===== メイン：一括処理（ログ付き）=====
Sub BatchGetAddressWithLog()

    Dim i As Long
    Dim lastRow As Long
    
    lastRow = Cells(Rows.Count, 1).End(xlUp).Row
    
    For i = 2 To lastRow
        
        Cells(i, 3).Value = "START"
        
        Dim result As String
        result = GetAddressWithLog(Cells(i, 1).Value, i)
        
        Cells(i, 2).Value = result
        
        If Left(result, 5) = "ERROR" Or result = "NOT_FOUND" Then
            Cells(i, 3).Value = result
        Else
            Cells(i, 3).Value = "OK"
        End If
        
        DoEvents
        Application.Wait Now + TimeValue("0:00:01") ' API制限対策
        
    Next i

End Sub


' ===== API呼び出し＋詳細ログ（修正版） =====
Function GetAddressWithLog(name As String, rowNum As Long) As String

    On Error GoTo ErrorHandler

    Dim apiKey As String
    ' ↓実際のAPIキーを設定してください
    apiKey = "AIzaSyCPHyrjQ0EK_TN7w00IyLM7qz8yXA9W2kg" 
    
    If name = "" Then
        Cells(rowNum, 3).Value = "ERROR: EMPTY_NAME"
        GetAddressWithLog = "ERROR: EMPTY_NAME"
        Exit Function
    End If
    
    ' 日本語指定
    Dim url As String
    url = "https://maps.googleapis.com/maps/api/geocode/json?address=" _
        & WorksheetFunction.EncodeURL(name) _
        & "&language=ja&region=jp&key=" & apiKey
    
    Cells(rowNum, 3).Value = "REQUEST_SENT"
    
    Dim http As Object
    Set http = CreateObject("MSXML2.XMLHTTP")
    
    http.Open "GET", url, False
    http.Send
    
    Cells(rowNum, 3).Value = "RESPONSE_RECEIVED"
    
    Dim response As String
    response = http.responseText
    
    ' --- ステータス確認（スペースの有無に依存しない判定） ---
    ' "status" と "OK" が両方含まれているかで簡易判定
    If InStr(response, """status""") > 0 And InStr(response, """OK""") > 0 Then
        ' 正常なので通過
    Else
        If InStr(response, "OVER_QUERY_LIMIT") > 0 Then
            Cells(rowNum, 3).Value = "ERROR: OVER_QUERY_LIMIT"
            GetAddressWithLog = "ERROR: OVER_QUERY_LIMIT"
            Exit Function
        End If
        
        If InStr(response, "REQUEST_DENIED") > 0 Then
            Cells(rowNum, 3).Value = "ERROR: REQUEST_DENIED"
            GetAddressWithLog = "ERROR: REQUEST_DENIED"
            Exit Function
        End If
        
        If InStr(response, "ZERO_RESULTS") > 0 Then
            Cells(rowNum, 3).Value = "NOT_FOUND"
            GetAddressWithLog = "NOT_FOUND"
            Exit Function
        End If
        
        Cells(rowNum, 3).Value = "ERROR: UNKNOWN_STATUS"
        GetAddressWithLog = "ERROR: UNKNOWN_STATUS"
        Exit Function
    End If
    
    ' --- 日本語住所抽出（文字数ではなく、記号の順番で特定する堅牢なロジック） ---
    Dim keyPos As Long
    keyPos = InStr(response, """formatted_address""")
    
    If keyPos > 0 Then
        ' formatted_addressの後の最初のコロン(:)を探す
        Dim colonPos As Long
        colonPos = InStr(keyPos, response, ":")
        
        ' コロンの後の最初のダブルクォーテーション(")を探す（＝値の開始）
        Dim startQuote As Long
        startQuote = InStr(colonPos, response, """")
        
        ' 次のダブルクォーテーション(")を探す（＝値の終了）
        Dim endQuote As Long
        endQuote = InStr(startQuote + 1, response, """")
        
        If startQuote > 0 And endQuote > startQuote Then
            Dim address As String
            address = Mid(response, startQuote + 1, endQuote - startQuote - 1)
            
            Cells(rowNum, 3).Value = "SUCCESS"
            GetAddressWithLog = address
            Exit Function
        End If
    End If
    
    Cells(rowNum, 3).Value = "ERROR: PARSE_FAIL"
    GetAddressWithLog = "ERROR: PARSE_FAIL"
    
    Exit Function

ErrorHandler:
    Cells(rowNum, 3).Value = "ERROR: EXCEPTION"
    GetAddressWithLog = "ERROR: EXCEPTION"

End Function
```
