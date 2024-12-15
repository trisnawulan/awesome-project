import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, TextInput, StyleSheet, Text, TouchableOpacity, ScrollView, Image, RefreshControl } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEdit, faSave, faSync, faHotel, faStar, faClock, faMapMarker } from '@fortawesome/free-solid-svg-icons';

const Createdata = () => {
    const jsonUrl = 'http://192.168.136.125:3000/mahasiswa';
    const [name, setName] = useState('');
    const [rating, setRating] = useState('');
    const [address, setAddress] = useState('');
    const [checkin, setCheckin] = useState('');
    const [checkout, setCheckout] = useState('');
    const [image, setImage] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [dataUser, setDataUser] = useState([]);
    const [refreshing, setRefreshing] = useState(false); // For Pull-to-Refresh

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        setRefreshing(true);  // Start the refresh animation
        fetch(jsonUrl)
            .then((response) => response.json())
            .then((json) => {
                console.log('Data terbaru:', json);
                setDataUser(json);
                setRefreshing(false);  // End the refresh animation
            })
            .catch((error) => {
                console.error('Error fetch data:', error);
                setRefreshing(false);  // End the refresh animation even on error
            });
    };

    const handleSubmit = () => {
        const data = { name, rating, address, checkin, checkout, image };
        if (!selectedUser) {
            return; // Prevent submitting if no user is selected
        }

        const url = `${jsonUrl}/${selectedUser.id}`;
        const method = 'PATCH'; // Edit data using PATCH method

        console.log('Data yang dikirim:', data);

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((json) => {
                console.log('Respons dari server:', json);
                alert('Data berhasil diperbarui!');
                clearForm();
                fetchData();
            })
            .catch((error) => console.error('Error:', error));
    };

    const clearForm = () => {
        setName('');
        setRating('');
        setAddress('');
        setCheckin('');
        setCheckout('');
        setImage('');
        setSelectedUser(null);
    };

    const selectItem = (item) => {
        setSelectedUser(item);
        setName(item.name);
        setRating(item.rating);
        setAddress(item.address);
        setCheckin(item.checkin);
        setCheckout(item.checkout);
        setImage(item.image);
    };

    const handleRefresh = () => {
        fetchData(); // Trigger the data refresh when button is pressed
        clearForm();  // Clear the form after refreshing
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.header, { backgroundColor: '#7bb7f0' }]}>
                <Text style={styles.headerText}>Edit Data</Text>
            </View>
            <View style={styles.formContainer}>
                {selectedUser && (
                    <>
                        <TextInput
                            style={styles.input}
                            placeholder="Nama Hotel"
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
                        <TextInput
                            style={styles.input}
                            placeholder="URL Gambar"
                            placeholderTextColor="#aaa"
                            value={image}
                            onChangeText={setImage}
                        />
                        <TouchableOpacity
                            style={[styles.button, styles.editButton]}
                            onPress={handleSubmit}
                        >
                            <FontAwesomeIcon icon={faSave} size={16} color="#fff" />
                            <Text style={styles.buttonText}>Simpan</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
            <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
                <FontAwesomeIcon icon={faSync} size={16} color="#fff" />
            </TouchableOpacity>
            <ScrollView
                style={styles.listContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing} // Whether the component is being refreshed
                        onRefresh={fetchData}  // Trigger fetchData when user pulls to refresh
                    />
                }
            >
                {dataUser.map((item) => (
                    <View key={item.id.toString()} style={styles.card}>
                        <View style={styles.avatar}>
                            {item.image ? (
                                <Image
                                    source={{ uri: item.image }}
                                    style={styles.image}
                                    onError={() => console.log('Gagal memuat gambar:', item.image)}
                                />
                            ) : (
                                <FontAwesomeIcon icon={faHotel} size={40} color="#11264e" />
                            )}
                        </View>
                        <View style={styles.cardContent}>
                            <Text style={styles.cardTitle}>{item.name}</Text>
                            <Text style={styles.cardText}><FontAwesomeIcon icon={faStar} size={16} color="#FFD700" /> {item.rating}</Text>
                            <Text style={styles.cardText}><FontAwesomeIcon icon={faClock} size={16} color="#000" /> {item.checkin} - {item.checkout}</Text>
                            <Text style={styles.cardText}><FontAwesomeIcon icon={faMapMarker} size={16} color="#000" />{item.address}</Text>
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
        color: '#11264e',
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
    editButton: {
        backgroundColor: '#11264e',
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
        marginRight: 15,
        borderRadius: 50,
        overflow: 'hidden',
        width: 60,
        height: 60,
        backgroundColor: '#e8f5e9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 25,
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
