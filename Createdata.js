import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, TextInput, TouchableOpacity, StyleSheet, Text, Alert, ScrollView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';

const Createdata = () => {
  const jsonUrl = 'http://192.168.136.125:3000/mahasiswa'; // Adjust API URL
  const orderUrl = 'http://192.168.136.125:4000/order'; // Adjust API URL
  const navigation = useNavigation();

  // State for dropdown and form
  const [roomDropdownOpen, setRoomDropdownOpen] = useState(false); // State untuk dropdown room
  const [bedDropdownOpen, setBedDropdownOpen] = useState(false); // State untuk dropdown bed
  const [selectedName, setSelectedName] = useState(null);
  const [names, setNames] = useState([]);
  const [jumlahKamar, setJumlahKamar] = useState(0);
  const [jenisKasur, setJenisKasur] = useState(null);
  const [catatan, setCatatan] = useState('');
  const [orderList, setOrderList] = useState([]); // State to hold submitted orders

  // Array of bed types for dropdown
  const bedTypes = [
    { label: 'Standard', value: 'Standard' },
    { label: 'King Bed', value: 'King Bed' },
    { label: 'Queen Bed', value: 'Queen Bed' },
    { label: 'Twin Bed', value: 'Twin Bed' },
  ];

  // Fetch data from API for dropdown
  useEffect(() => {
    fetch(jsonUrl)
      .then((response) => response.json())
      .then((json) => {
        const dropdownItems = json.map((item) => ({
          label: item.name,
          value: item.name,
        }));
        setNames(dropdownItems);
      })
      .catch(() => Alert.alert('Error', 'Failed to load data.'));


      
  }, []);

  // Function to handle order submission
  const handlePesan = () => {
    if (!selectedName) {
      Alert.alert('Warning', 'Please select a room name!');
      return;
    }

    if (!jenisKasur) {
      Alert.alert('Warning', 'Please select a bed type!');
      return;
    }

    const dataPesanan = {
      name: selectedName,
      jumlahKamar,
      jenisKasur,
      catatan,
    };

                // Tambah data baru
                fetch(orderUrl, {
                  method: 'POST',
                  headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(dataPesanan),
              })
                  .then((response) => response.json())
                  .then(() => {
                      alert('Data tersimpan');
                      resetForm();
                      refreshPage();
                  });


        navigation.navigate('Pesanan');
         
    // Add order to the list
    setOrderList((prevList) => [...prevList, dataPesanan]);

    // Clear the form after submission
    setSelectedName(null);
    setJumlahKamar(0);
    setJenisKasur(null);
    setCatatan('');
    
    Alert.alert('Success', 'Order has been added to the list!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Pesan Kamar</Text>

      <View style={styles.formContainer}>
        {/* Room Name Dropdown */}
        <DropDownPicker
          open={roomDropdownOpen}
          value={selectedName}
          items={names}
          setOpen={setRoomDropdownOpen}
          setValue={setSelectedName}
          setItems={setNames}
          placeholder="Pilih Hotel"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownList}
          onOpen={() => setBedDropdownOpen(false)} // Close the bed dropdown when room dropdown opens
        />

        {/* Jumlah Kamar */}
        <View style={styles.counterContainer}>
          <Text style={styles.label}>Jumlah Kamar:</Text>
          <TouchableOpacity style={styles.counterButton} onPress={() => setJumlahKamar(Math.max(0, jumlahKamar - 1))}>
            <Text style={styles.counterText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.counterValue}>{jumlahKamar}</Text>
          <TouchableOpacity style={styles.counterButton} onPress={() => setJumlahKamar(jumlahKamar + 1)}>
            <Text style={styles.counterText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Jenis Kasur Dropdown */}
        <DropDownPicker
          open={bedDropdownOpen}
          value={jenisKasur}
          items={bedTypes}
          setOpen={setBedDropdownOpen}
          setValue={setJenisKasur}
          setItems={setNames}
          placeholder="Pilih Tipe Kamar"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownList}
          onOpen={() => setRoomDropdownOpen(false)} // Close the room dropdown when bed dropdown opens
        />

        {/* Notes */}
        <TextInput
          style={styles.textArea}
          placeholder="Catatan"
          value={catatan}
          onChangeText={(text) => setCatatan(text)}
          multiline
        />

        {/* Order Button */}
        <TouchableOpacity style={styles.button} onPress={handlePesan}>
          <Text style={styles.buttonText}>Pesan Sekarang</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Order List */}
      <View style={styles.orderListContainer}>
        <Text style={styles.orderListHeader}>Order List:</Text>
        <ScrollView>
          {orderList.map((order, index) => (
            <View key={index} style={styles.orderItem}>
              <Text>{`Hotel: ${order.name}`}</Text>
              <Text>{`Jumlah Kamar: ${order.jumlahKamar}`}</Text>
              <Text>{`Tipe Kasur: ${order.jenisKasur}`}</Text>
              <Text>{`Catatan: ${order.catatan}`}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    width: '100%',
    maxWidth: 400,
    justifyContent: 'center',
    marginTop: 30, // Space between header and form
  },
  dropdown: {
    marginBottom: 15,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  dropdownList: {
    borderColor: '#ccc',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  counterButton: {
    backgroundColor: '#2196F3',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  counterText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  counterValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#11264e',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderListContainer: {
    marginTop: 20,
    width: '100%',
    maxWidth: 400, // Ensuring the order list doesn't exceed width
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    height: 200, // Set height to limit the scrollable area
  },
  orderListHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  orderItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
});

export default Createdata;
