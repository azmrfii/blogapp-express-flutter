// import 'package:flutter/material.dart';

// void main() {
//   runApp(const MainApp());
// }

// class MainApp extends StatelessWidget {
//   const MainApp({super.key});

//   @override
//   Widget build(BuildContext context) {
//     return const MaterialApp(
//       home: Scaffold(
//         body: Center(
//           child: Text('Hello World!'),
//         ),
//       ),
//     );
//   }
// }

import 'package:flutter/material.dart';
import 'package:onesignal_flutter/onesignal_flutter.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() {
  runApp(const MyApp());
}

const String oneSignalAppId = 'f25fa782-d712-4633-91ea-8d6237bd8608';
const String apiUrl =
    'http://192.168.110.202:5000/api/onesignal/save-player-id'; // Ganti dengan IP backend Express kamu

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  String? _playerId;
  String _status = "Initializing...";

  @override
  void initState() {
    super.initState();
    _initializeOneSignal();
  }

  Future<void> _initializeOneSignal() async {
    OneSignal.Debug.setLogLevel(OSLogLevel.verbose);
    OneSignal.initialize(oneSignalAppId);
    await OneSignal.Notifications.requestPermission(true);

    Future.delayed(Duration(seconds: 2), () async {
      final playerId = OneSignal.User.pushSubscription.id;
      final isSubscribed = OneSignal.User.pushSubscription.optedIn ?? false;

      print("PLAYER ID: $playerId | Subscribed: $isSubscribed");

      if (playerId != null) {
        setState(() {
          _playerId = playerId;
          _status = "Subscribed with playerId: $playerId";
          _sendToServer(playerId);
        });
      } else {
        setState(() {
          _status = "Belum subscribed atau playerId null";
        });
      }
    });
  }

  Future<void> _sendToServer(String playerId) async {
    try {
      final response = await http.post(
        Uri.parse(apiUrl),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'player_id': playerId, 'user_id': 1}),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        setState(() => _status = "Player ID sent successfully!");
      } else {
        setState(
            () => _status = "Failed to send. Status: ${response.statusCode}");
      }
    } catch (e) {
      setState(() => _status = "Error: $e");
      print("Error sending to server: $e");
    }
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: const Text('Send Player ID')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('Player ID: ${_playerId ?? "Loading..."}'),
              const SizedBox(height: 10),
              Text(_status),
            ],
          ),
        ),
      ),
    );
  }
}
