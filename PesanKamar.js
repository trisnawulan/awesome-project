import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  Text,
  ScrollView,
  StyleSheet,
  View,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';

const PesanKamar = () => {
  const [pesanan, setPesanan] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const orderUrl = 'http://192.168.136.125:4000/order'; // Adjust API URL

  // Fetch data from server
  const fetchData = async () => {
    try {
      const response = await fetch(orderUrl);
      const json = await response.json();
      setPesanan(json);
    } catch (error) {
      Alert.alert('Error', 'Failed to load data.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData().finally(() => setRefreshing(false));
  };

  // Hapus pesanan berdasarkan ID
  const handleHapus = async (id) => {
    try {
      const response = await fetch(`${orderUrl}/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        Alert.alert('Success', 'Pesanan berhasil dihapus.');
        fetchData(); // Refresh data
      } else {
        Alert.alert('Error', 'Gagal menghapus pesanan.');
      }
    } catch (error) {
      Alert.alert('Error', 'Terjadi kesalahan.');
    }
  };

  // Tandai pesanan sebagai selesai
  const handleSelesai = async (id) => {
    try {
      const response = await fetch(`${orderUrl}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Selesai' }),
      });
      if (response.ok) {
        Alert.alert('Success', 'Pesanan ditandai sebagai selesai.');
        fetchData(); // Refresh data
      } else {
        Alert.alert('Error', 'Gagal memperbarui pesanan.');
      }
    } catch (error) {
      Alert.alert('Error', 'Terjadi kesalahan.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Pesanan</Text>
      <ScrollView
        style={styles.orderListContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.subHeader}>Pesanan Aktif</Text>
        {pesanan
          .filter((item) => item.status !== 'Selesai')
          .map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.row}>
                {/* <View style={styles.icon} /> */}
                <View style={styles.details}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.info}>{item.jenisKasur}</Text>
                  <Text style={styles.note}>{`Jumlah Kamar: ${item.jumlahKamar}`}</Text>
                  <Text style={styles.note}>{`Catatan: ${item.catatan}`}</Text>
                </View>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleHapus(item.id)}
                >
                  <Text style={styles.buttonText}>Hapus</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={() => handleSelesai(item.id)}
                >
                  <Text style={styles.buttonText}>Selesai</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

        <Text style={styles.subHeader}>Pesanan Selesai</Text>
        {pesanan
          .filter((item) => item.status === 'Selesai')
          .map((item) => (
            <View key={item.id} style={[styles.card, styles.completedCard]}>
              <View style={styles.row}>
                {/* <View style={styles.icon} /> */}
                <View style={styles.details}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.info}>{item.jenisKasur}</Text>
                  <Text style={styles.note}>{`Jumlah Kamar: ${item.jumlahKamar}`}</Text>
                  <Text style={styles.note}>{`Catatan: ${item.catatan}`}</Text>
                </View>
              </View>
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, backgroundColor: '#f4f4f4' 
  },
  header: {
    backgroundColor: '#7bb7f0',
    paddingVertical: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)',
    alignItems: 'center',
    position: 'absolute',
    width: '110%',
    top: 0,
    zIndex: 1000,
    fontSize: 26,
    fontWeight: 'bold',
    color: '#11264e',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 30, // Added margin for space between header and form
  },
  subHeader: { 
    flex: 1,
    paddingTop: 50,
    fontSize: 18, 
    fontWeight: '600', 
    marginHorizontal: 15, 
    marginVertical: 10 
  },
  orderListContainer: { 
    flex: 1,
    paddingTop: 20, // Tambahkan padding untuk mendorong konten ke bawah
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  completedCard: { backgroundColor: '#e8ffe8' },
  row: { flexDirection: 'row', alignItems: 'center' },
  // icon: {
  //   width: 50,
  //   height: 50,
  //   backgroundColor: '#000',
  //   borderRadius: 5,
  //   marginRight: 15,
  // },
  details: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold' },
  info: { fontSize: 14, color: '#555' },
  note: { fontSize: 12, color: '#777' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  deleteButton: {
    flex: 1,
    backgroundColor: '#E63946',
    borderRadius: 5,
    padding: 8,
    marginRight: 5,
    alignItems: 'center',
  },
  doneButton: {
    flex: 1,
    backgroundColor: '#11264e',
    borderRadius: 5,
    padding: 8,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default PesanKamar;
