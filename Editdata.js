import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, TextInput, Button, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-virtualized-view';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPenToSquare, faGraduationCap } from '@fortawesome/free-solid-svg-icons';

const Createdata = () => {
    const jsonUrl = 'http://192.168.82.125:3000/mahasiswa'; // Ganti dengan IP server Anda
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [kelas, setKelas] = useState('');
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState('');
    const [selectedUser, setSelectedUser] = useState({});
    const [isLoading, setLoading] = useState(true);
    const [dataUser, setDataUser] = useState([]);
    const [refresh, setRefresh] = useState(false);

    // Fetch data from API
    const fetchData = () => {
        setLoading(true);
        fetch(jsonUrl)
            .then((response) => response.json())
            .then((json) => {
                console.log('Fetched data:', json);
                setDataUser(json);
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const refreshPage = () => {
        setRefresh(true);
        fetchData();
        setRefresh(false);
    };

    const selectItem = (item) => {
        setSelectedUser(item);
        setFirstName(item.first_name);
        setLastName(item.last_name);
        setKelas(item.kelas);
        setGender(item.gender);
        setEmail(item.email);
    };

    const submit = () => {
        const data = {
            first_name: first_name,
            last_name: last_name,
            email: email,
            kelas: kelas,
            gender: gender,
        };

        fetch(`http://192.168.82.125:3000/mahasiswa/${selectedUser.id}`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((json) => {
                console.log('Response:', json);
                alert('Data berhasil diperbarui');
                setFirstName('');
                setLastName('');
                setKelas('');
                setGender('');
                setEmail('');
                refreshPage();
            })
            .catch((error) => console.error(error));
    };

    return (
        <SafeAreaView style={styles.container}>
            <View>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.cardtitle}>Loading...</Text>
                    </View>
                ) : (
                    <View>
                        <ScrollView style={styles.form}>
                            <View>
                                <Text style={styles.title}>Edit Data Mahasiswa</Text>
                                <View style={styles.form}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Nama Depan"
                                        value={first_name}
                                        onChangeText={(value) => setFirstName(value)}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Nama Belakang"
                                        value={last_name}
                                        onChangeText={(value) => setLastName(value)}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Kelas"
                                        value={kelas}
                                        onChangeText={(value) => setKelas(value)}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Jenis Kelamin"
                                        value={gender}
                                        onChangeText={(value) => setGender(value)}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Email"
                                        value={email}
                                        onChangeText={(value) => setEmail(value)}
                                    />
                                    <Button title="Edit" style={styles.button} onPress={submit} />
                                </View>
                            </View>
                            <View style={styles.devider}></View>

                            <FlatList
                                style={{ marginBottom: 10 }}
                                data={dataUser}
                                onRefresh={refreshPage}
                                refreshing={refresh}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => selectItem(item)}>
                                        <View style={styles.card}>
                                            <View style={styles.avatar}>
                                                <FontAwesomeIcon icon={faGraduationCap} size={50} />
                                            </View>
                                            <View>
                                                <Text style={styles.cardtitle}>
                                                    {item.first_name} {item.last_name}
                                                </Text>
                                                <Text>{item.kelas}</Text>
                                                <Text>{item.gender}</Text>
                                            </View>
                                            <View style={styles.editIcon}>
                                                <FontAwesomeIcon icon={faPenToSquare} size={20} />
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        </ScrollView>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

export default Createdata;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    title: {
        paddingVertical: 12,
        backgroundColor: '#333',
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    form: {
        padding: 10,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#777',
        borderRadius: 8,
        padding: 8,
        width: '100%',
        marginVertical: 5,
    },
    button: {
        marginVertical: 10,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    avatar: {
        marginRight: 10,
    },
    cardtitle: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    editIcon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    loadingContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
});
