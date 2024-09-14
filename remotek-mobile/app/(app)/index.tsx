import React, { useState, useRef } from 'react';
import { View, Button, Text, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { sendShutdownRemoteCommand } from "../../lib/services/remoteCommandService";
import { useSession } from '@/ctx';

export default function ShutdownScreen() {
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [cancelled, setCancelled] = useState(false);
  const countdownIntervalRef = useRef<any>(null);
  const timeoutRef = useRef<any>(null);

  const { signOut } = useSession();

  const resetStates = () => {
    setLoading(false);
    setCountdown(0);
    setCancelled(false);
  };

  const sendShutdownCommand = async () => {
    resetStates();
    setLoading(true);
    setCancelled(false);
    setCountdown(10);

    countdownIntervalRef.current = setInterval(() => {
      setCountdown(prevCountdown => prevCountdown - 1);
    }, 1000);

    timeoutRef.current = setTimeout(async () => {
      clearInterval(countdownIntervalRef.current);
      if (!cancelled) {
        try {
          const response = await sendShutdownRemoteCommand();
          Alert.alert('Success', 'The computer is shutting down.');
        } catch (error) {
          console.error(error);
          Alert.alert('Error', 'An error occurred while sending the command.');
        }
      } else {
        Alert.alert('Cancelled', 'The shutdown process was cancelled.');
      }
      resetStates();
    }, 10000);
  };

  const handleCancel = () => {
    clearInterval(countdownIntervalRef.current);
    clearTimeout(timeoutRef.current);
    Alert.alert('Cancelled', 'The shutdown process was cancelled.');
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      { loading ? null : (<TouchableOpacity style={styles.logoutButton} onPress={signOut}>
        <Text style={styles.logoutButtonText}>Log out</Text>
      </TouchableOpacity>)}
      <Text style={styles.title}>Shutdown Computer</Text>
      {loading ? (
        <View>
          {countdown > 0 ? (
            <Text style={styles.countdownText}>{countdown} seconds until the computer shuts down...</Text>
          ) : (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
          <Button title="Cancel" onPress={handleCancel} />
        </View>
      ) : (
        <Button title="Shutdown Computer" onPress={sendShutdownCommand} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    position: 'relative',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  countdownText: {
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
  },
  logoutButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#ff0000',
    padding: 10,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});
