

using System;
using System.Collections.Generic;
using System.IO;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;
using Newtonsoft.Json;

namespace A_06
{
          public partial class startPage : System.Web.UI.Page
          {
                    /* ===================================================== /
                    / FUNCTION : GetFile()                                   /
                    / DESCRIPTION : Retrieve a list of files from the server /
                    / PARAMETERS : None                                      /
                    / RETURN VALUES : List of file names                     /
                    / ===================================================== */
                    [WebMethod]
                    public static string GetFile()
                    {
                              // Retrieve a list of files from the server
                              string serverFilePath = HttpContext.Current.Server.MapPath("~/MyFiles");
                              var files = Directory.GetFiles(serverFilePath);
                              var fileList = new List<string>();
                              foreach (var file in files)
                              {
                                        fileList.Add(Path.GetFileName(file));
                              }
                              var serialization = new JavaScriptSerializer();
                              return serialization.Serialize(fileList);
                    }

                    /* ===================================================== /
                    / FUNCTION : loadFileContent()                           /
                    / DESCRIPTION : Load content of a specific file          /
                    / PARAMETERS : fileName - The name of the file to load   /
                    / RETURN VALUES : Content of the file                    /
                    / ===================================================== */
                    [WebMethod]
                    public static string loadFileContent(string fileName)
                    {
                              // Load content of a specific file
                              string filePath = HttpContext.Current.Server.MapPath("~/MyFiles/");
                              var fullPath = Path.Combine(filePath, fileName);
                              if (File.Exists(fullPath))
                              {
                                        string fileContent = File.ReadAllText(fullPath);
                                        var jsonContent = JsonConvert.SerializeObject(fileContent);
                                        return jsonContent;
                              }
                              else
                              {
                                        return string.Empty;
                              }
                    }

                    /* ===================================================== /
                    / FUNCTION : SaveFileContent()                           /
                    / DESCRIPTION : Save content to the specified file       /
                    / PARAMETERS : fileName - The name of the file to save to/
                    /               content - The content to be saved        /
                    / RETURN VALUES : Success message or error message       /
                    / ===================================================== */
                    [WebMethod]
                    public static string SaveFileContent(string fileName, string content)
                    {
                              try
                              {
                                        // Save content to the specified file
                                        string filePath = HttpContext.Current.Server.MapPath("~/MyFiles/");
                                        var fullPath = Path.Combine(filePath, fileName);
                                        File.WriteAllText(fullPath, content);

                                        return "File saved successfully.";
                              }
                              catch (Exception ex)
                              {
                                        return "Error saving file: " + ex.Message;
                              }
                    }

                    /* ===================================================== /
                    / FUNCTION : SaveAsFileContent()                         /
                    / DESCRIPTION : Save content to a new file with a        /
                    /               different name                           /
                    / PARAMETERS : oldFileName - The current file name       /
                    /               newFileName - The new file name          /
                    /               content - The content to be saved        /
                    / RETURN VALUES : Success message or error message       /
                    / ===================================================== */
                    [WebMethod]
                    public static string SaveAsFileContent(string oldFileName, string newFileName, string content)
                    {
                              try
                              {

                                        // Save content to a new file with a different name
                                        string filePath = HttpContext.Current.Server.MapPath("~/MyFiles/");
                                        var oldFullPath = Path.Combine(filePath, oldFileName);
                                        var newFullPath = Path.Combine(filePath, newFileName);

                                        File.WriteAllText(newFullPath, content);

                                        return "File saved successfully.";
                              }
                              catch (Exception ex)
                              {
                                        return "Error saving file: " + ex.Message;
                              }
                    }
          }
}