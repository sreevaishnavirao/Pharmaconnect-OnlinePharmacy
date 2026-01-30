package com.onlinepharmacy.backend.service;

import com.onlinepharmacy.backend.model.User;
import com.onlinepharmacy.backend.payload.AddressDTO;

import java.util.List;

public interface AddressService {
    AddressDTO createAddress(AddressDTO addressDTO, User user);
    List<AddressDTO> getAddresses();
    AddressDTO getAddressesById(Long addressId);
    List<AddressDTO> getUserAddresses(User user);
    AddressDTO updateAddress(Long addressId, AddressDTO addressDTO);
    String deleteAddress(Long addressId);
}