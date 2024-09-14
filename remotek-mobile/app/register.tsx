import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, Button, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Link, router } from 'expo-router';
import { useSession } from '@/ctx';

async function saveToken(token: string) {
    await SecureStore.setItemAsync('userToken', token);
}

export default function Register() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');

    const { register } = useSession();

    const handleRegister = async () => {
        if (password !== passwordRepeat) {
            Alert.alert('Passwords do not match');
            return;
        }
        await register({ firstName, lastName, email, password });
        Alert.alert('Registration Successful!');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Register</Text>
            <View style={styles.inputRow}>
                <TextInput
                    style={[styles.input, styles.inputHalf]}
                    placeholder="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                    keyboardType="default"
                    autoCapitalize="words"
                />
                <TextInput
                    style={[styles.input, styles.inputHalf]}
                    placeholder="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                    keyboardType="default"
                    autoCapitalize="words"
                />
            </View>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password Repeat"
                value={passwordRepeat}
                onChangeText={setPasswordRepeat}
                secureTextEntry
                autoCapitalize="none"
            />
            <Button title="Register" onPress={handleRegister} />
            <Link href="/sign-in">Login</Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    heading: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputHalf: {
        flex: 1,
        marginRight: 8,
    },
});