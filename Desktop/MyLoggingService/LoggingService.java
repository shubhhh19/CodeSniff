package MyLoggingService;

import java.io.*;
import java.net.*;

public class LoggingService {
    public static void main(String[] args) {
        BufferedReader consoleReader = new BufferedReader(new InputStreamReader(System.in));

        try {
            System.out.print("Enter the IP address: ");
            String ipAddress = consoleReader.readLine();

            System.out.print("Enter the port number: ");
            int port = Integer.parseInt(consoleReader.readLine());

            try (ServerSocket serverSocket = new ServerSocket(port, 50, InetAddress.getByName(ipAddress))) {
                System.out.println("Logging service is running on " + ipAddress + ":" + port);

                while (true) {
                    Socket clientSocket = serverSocket.accept();
                    System.out.println("New client connected: " + clientSocket.getInetAddress().getHostAddress());

                    // Notify the user about successful client connection
                    PrintWriter notifyWriter = new PrintWriter(clientSocket.getOutputStream(), true);
                    notifyWriter.println("Connected to the logging service successfully.");

                    // Handle the client in a separate thread
                    new Thread(() -> handleClient(clientSocket)).start();
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                consoleReader.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    private static void handleClient(Socket clientSocket) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
             BufferedWriter logWriter = new BufferedWriter(new FileWriter("logs.txt", true))) {

            String logMessage;
            while ((logMessage = reader.readLine()) != null) {
                System.out.println("Received log message: " + logMessage);

                // Save the log message to the logs.txt file
                logWriter.write(logMessage);
                logWriter.newLine();
                logWriter.flush();
            }

            System.out.println("Client disconnected: " + clientSocket.getInetAddress().getHostAddress());

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
