import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, TextInput, StyleSheet, Text, TouchableOpacity, ScrollView,} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {  faEdit, faSave, faPlus, faSync, faHotel } from '@fortawesome/free-solid-svg-icons';

const Createdata = () => {
    const jsonUrl = 'http://192.168.136.125:3000/mahasiswa';
    const [name, setName] = useState('');
    const [rating, setRating] = useState('');
    const [address, setAddress] = useState('');
    const [checkin, setCheckin] = useState('');
    const [checkout, setCheckout] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [dataUser, setDataUser] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        fetch(jsonUrl)
            .then((response) => response.json())
            .then((json) => setDataUser(json))
            .catch((error) => console.error(error));
    };

    const handleSubmit = () => {
        const data = { name, rating, address, checkin, checkout };
        const url = selectedUser ? `${jsonUrl}/${selectedUser.id}` : jsonUrl;
        const method = selectedUser ? 'PATCH' : 'POST';

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
            .then(() => {
                alert(selectedUser ? 'Data berhasil diperbarui!' : 'Data berhasil ditambahkan!');
                clearForm();
                fetchData();
            })
            .catch((error) => console.error(error));
    };

    const clearForm = () => {
        setName('');
        setRating('');
        setAddress('');
        setCheckin('');
        setCheckout('');
        setSelectedUser(null);
    };

    const selectItem = (item) => {
        setSelectedUser(item);
        setName(item.name);
        setRating(item.rating);
        setAddress(item.address);
        setCheckin(item.checkin);
        setCheckout(item.checkout);
    };

    const handleRefresh = () => {
        fetchData();
        clearForm();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.header, { backgroundColor: selectedUser ?  '#11264e': '#7bb7f0' }]}>
                <Text style={styles.headerText}>{selectedUser ? 'Edit Data' : 'Tambah Data'}</Text>
            </View>
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Hotel Kota Yogyakarta"
                    placeholderTextColor="#aaa"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Rating"
                    placeholderTextColor="#aaa"
                    value={rating}
                    onChangeText={setRating}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Alamat"
                    placeholderTextColor="#aaa"
                    value={address}
                    onChangeText={setAddress}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Jam Check-in"
                    placeholderTextColor="#aaa"
                    value={checkin}
                    onChangeText={setCheckin}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Jam Check-out"
                    placeholderTextColor="#aaa"
                    value={checkout}
                    onChangeText={setCheckout}
                />
                <TouchableOpacity
                    style={[styles.button, selectedUser ? styles.editButton : styles.addButton]}
                    onPress={handleSubmit}
                >
                    <FontAwesomeIcon icon={selectedUser ? faSave : faPlus} size={16} color="#fff" />
                    <Text style={styles.buttonText}>{selectedUser ? 'Simpan' : 'Tambah'}</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
                <FontAwesomeIcon icon={faSync} size={16} color="#fff" />
            </TouchableOpacity>
            <ScrollView style={styles.listContainer}>
                {dataUser.map((item) => (
                    <View key={item.id} style={styles.card}>
                        <View style={styles.avatar}>
                            <FontAwesomeIcon icon={faHotel} size={40} color="#11264e" />
                        </View>
                        <View style={styles.cardContent}>
                            <Text style={styles.cardTitle}>{item.name}</Text>
                            <Text style={styles.cardText}>Rating: {item.rating}</Text>
                            <Text style={styles.cardText}>Alamat: {item.address}</Text>
                            <Text style={styles.cardText}>
                                Jam Operasional: {item.checkin} - {item.checkout}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => selectItem(item)} style={styles.editButtonCard}>
                            <FontAwesomeIcon icon={faEdit} size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
    },
    header: {
        paddingVertical: 15,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
        alignItems: 'center',
        marginBottom: 20,
    },
    headerText: {
        fontSize: 26,
        color: '#fff',
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    formContainer: {
        padding: 10,
        backgroundColor: '#fff',
        margin: 10,
        borderRadius: 10,
        elevation: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
        color: '#333',
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        borderRadius: 10,
        elevation: 3,
    },
    addButton: {
        backgroundColor: '#11264e',
    },
    editButton: {
        backgroundColor: '#7bb7f0',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    refreshButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
        backgroundColor: '#2196F3',
        borderRadius: 50,
        position: 'absolute',
        top: 20,
        right: 10,
        elevation: 3,
    },
    listContainer: {
        marginHorizontal: 10,
        marginTop: 10,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 5,
        borderRadius: 10,
        elevation: 3,
    },
    avatar: {
        backgroundColor: '#e8f5e9',
        padding: 10,
        borderRadius: 50,
    },
    cardContent: {
        flex: 1,
        marginLeft: 15,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    cardText: {
        color: '#666',
    },
    editButtonCard: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 50,
        elevation: 2,
    },
});

export default Createdata;