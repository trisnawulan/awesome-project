import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, TextInput, Button, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPenToSquare, faGraduationCap } from '@fortawesome/free-solid-svg-icons';

const Createdata = () => {
    const jsonUrl = 'http://192.168.136.125:3000/mahasiswa';
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [kelas, setKelas] = useState('');
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState('');
    const [selectedUser, setSelectedUser] = useState({});
    const [isLoading, setLoading] = useState(true);
    const [dataUser, setDataUser] = useState([]);
    const [refresh, setRefresh] = useState(false);

    const fetchData = () => {
        setLoading(true);
        fetch(jsonUrl)
            .then((response) => response.json())
            .then((json) => {
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

    const resetForm = () => {
        setFirstName('');
        setLastName('');
        setKelas('');
        setGender('');
        setEmail('');
        setSelectedUser({});
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

        if (selectedUser && selectedUser.id) {
            // Edit data
            fetch(`${jsonUrl}/${selectedUser.id}`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then((response) => response.json())
                .then(() => {
                    alert('Data diperbarui');
                    resetForm();
                    refreshPage();
                });
        } else {
            // Tambah data baru
            fetch(jsonUrl, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then((response) => response.json())
                .then(() => {
                    alert('Data tersimpan');
                    resetForm();
                    refreshPage();
                });
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                {isLoading ? (
                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                        <Text style={styles.cardtitle}>Loading...</Text>
                    </View>
                ) : (
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title}>Edit Data Mahasiswa</Text>
                        <View style={styles.form}>
                            <TextInput style={styles.input} placeholder="Nama Depan" value={first_name} onChangeText={setFirstName} />
                            <TextInput style={styles.input} placeholder="Nama Belakang" value={last_name} onChangeText={setLastName} />
                            <TextInput style={styles.input} placeholder="Kelas" value={kelas} onChangeText={setKelas} />
                            <TextInput style={styles.input} placeholder="Jenis Kelamin" value={gender} onChangeText={setGender} />
                            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
                            <Button
                                title={selectedUser && selectedUser.id ? 'Perbarui' : 'Simpan'}
                                style={styles.button}
                                onPress={submit}
                            />
                        </View>
                        <FlatList
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
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                                            <FontAwesomeIcon icon={faPenToSquare} size={20} />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

export default Createdata;

const styles = StyleSheet.create({
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
        padding: 15,
        marginVertical: 5,
        marginHorizontal: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        elevation: 2,
    },
    avatar: {
        marginRight: 15,
    },
    cardtitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
