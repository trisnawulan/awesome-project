import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator, Linking, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrash, faSync, faMapMarkerAlt, faHotel, faStar, faClock, faMapMarker } from '@fortawesome/free-solid-svg-icons';

const Listdata = () => {
  const jsonUrl = 'http://192.168.136.125:3000/mahasiswa';
  const [isLoading, setLoading] = useState(true);
  const [dataUser, setDataUser] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const fetchData = () => {
    setLoading(true);
    fetch(jsonUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Gagal mengambil data');
        }
        return response.json();
      })
      .then((json) => setDataUser(json))
      .catch((error) => {
        console.error(error);
        Alert.alert('Error', 'Gagal memuat data. Periksa koneksi Anda.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshPage = () => {
    setRefresh(true);
    fetchData();
    setTimeout(() => setRefresh(false), 1000);
  };

  const deleteData = (id) => {
    if (!id) {
      Alert.alert('Error', 'ID tidak valid.');
      return;
    }
    fetch(`${jsonUrl}/${id}`, { method: 'DELETE' })
      .then(() => {
        Alert.alert('Sukses', 'Data berhasil dihapus!');
        fetchData();
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('Error', 'Gagal menghapus data. Coba lagi nanti.');
      });
  };

  const openInMaps = (latitude, longitude) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'Tidak dapat membuka Google Maps.')
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Daftar Hotel</Text>
      </View>
      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : !isLoading && dataUser.length === 0 ? (
        <View style={styles.loader}>
          <Text style={styles.loadingText}>Tidak ada data untuk ditampilkan.</Text>
        </View>
      ) : (
        <FlatList
          data={dataUser}
          onRefresh={refreshPage}
          refreshing={refresh}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card}>
              <View style={styles.avatar}>
                {item.image ? (
                  <Image
                    source={{ uri: item.image }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                ) : (
                  <FontAwesomeIcon icon={faHotel} size={40} color="#11264e" />
                )}
              </View>

              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={styles.rating}>
                  <FontAwesomeIcon icon={faStar} size={16} color="#FFD700" /><Text style={styles.ratingText}>{item.rating}</Text>
                </View>
                
                <Text style={styles.detail}><FontAwesomeIcon icon={faClock} size={16} color="#11264e" /> {item.checkin} - {item.checkout}
                </Text>
                <Text style={styles.detail}><FontAwesomeIcon icon={faMapMarker} size={16} color="#11264e" />{item.address}</Text>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.mapButton}
                  onPress={() => openInMaps(item.latitude, item.longitude)}
                >
                  <FontAwesomeIcon icon={faMapMarkerAlt} size={20} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() =>
                    Alert.alert('Hapus Data', 'Yakin ingin menghapus data ini?', [
                      { text: 'Tidak', onPress: () => console.log('Tidak') },
                      { text: 'Ya', onPress: () => deleteData(item.id) },
                    ])
                  }
                >
                  <FontAwesomeIcon icon={faTrash} size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={refreshPage}>
        <FontAwesomeIcon icon={faSync} size={20} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Listdata;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f9',
  },
  header: {
    backgroundColor: '#7bb7f0',
    paddingVertical: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 26,
    color: '#11264e',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#11264e',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  detail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  mapButton: {
    backgroundColor: '#11264e',
    padding: 10,
    borderRadius: 50,
    elevation: 3,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#E63946',
    padding: 10,
    borderRadius: 50,
    elevation: 3,
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#7bb7f0',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.5,
  },
});
