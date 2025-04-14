<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="startPage.aspx.cs" Inherits="A_06.startPage" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Online Text Editor</title>
    <link rel="icon" href="favicon.ico" type="image/x-icon" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script type="text/javascript" src="Jquery.js"></script>
    <style>
        /* Styling for the editor */
        body {
            font-family: 'Helvetica', sans-serif;
            background-color: #87CEEB;
            color: #333;
            margin: 0;
            padding: 0;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
        }

        #form1 {
            width: 50%;
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            box-sizing: border-box;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        label {
            font-size: 16px;
            color: #333;
            display: block;
            margin-bottom: 10px;
        }

        #fileList {
            padding: 8px;
            font-size: 14px;
            margin-bottom: 15px;
            width: 100%;
            box-sizing: border-box;
        }

        #editor {
            padding: 10px;
            font-size: 14px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
            width: 100%;
            box-sizing: border-box;
        }

        #saveButton, #saveAsButton {
            background-color: #F39C12; 
            color: #fff;
            padding: 10px 20px;
            font-size: 16px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin-right: 10px;
        }

        #saveAsButton {
            background-color: #F1C40F;
        }
    </style>
</head>
<body>
    <!-- Main form container -->
    <form id="form1" runat="server">
        <div>
            <!-- Label for file selection dropdown -->
            <label for="fileList">Choose the file:</label>
            <!-- File selection dropdown -->
            <select id="fileList"></select>
            <br />
            <!-- Text editor textarea -->
            <textarea id="editor" rows="10" cols="50"></textarea>
            <br />
            <!-- Save and Save As buttons -->
            <button id="saveButton">Save</button>
            <button id="saveAsButton">Save As</button>
        </div>
    </form>
</body>
</html>