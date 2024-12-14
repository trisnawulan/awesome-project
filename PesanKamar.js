import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PesanKamar = ({ route }) => {
  // Cek aman jika route atau params kosong
  const { pesanan } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Detail Pesanan Kamar</Text>
      <Text style={styles.text}>Nama Kamar: {pesanan?.name || 'Tidak Ada'}</Text>
      <Text style={styles.text}>Jumlah Kamar: {pesanan?.jumlahKamar || '0'}</Text>
      <Text style={styles.text}>Jenis Kasur: {pesanan?.jenisKasur || 'Tidak Ada'}</Text>
      <Text style={styles.text}>Catatan: {pesanan?.catatan || 'Tidak Ada Catatan'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#11264e',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    color: '#333',
    marginVertical: 5,
  },
});

export default PesanKamar;
