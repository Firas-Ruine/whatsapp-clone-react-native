import React, { useState } from "react";
import { Link } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import AuthService from "@/services/authService";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import * as ImagePicker from "expo-image-picker";


const Register = () => {
  const {register} = AuthService();
  const [isLoding, setIsLoding] = useState(false);
  const keyboardVerticalOffset = Platform.OS === "ios" ? 90 : 0;
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];
  const [profileImage, setProfileImage] = useState<string | null>(null);

  /**
   * This is the validation schema for the registration form
   *
   * @param {string} name - The name of the user
   * @param {string} email - The email of the user
   * @param {string} password - The password of the user
   * @param {string} confirmPassword - The password of the user
   *
   * @returns {object} - The validation schema for the registration form
   */
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password is too short"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), ""], "Passwords must match")
      .required("Confirm password is required"),
  });

  /**
   * This function is used to sign in a user
   *
   * @param {string} name - The name of the user
   * @param {string} email - The email of the user
   * @param {string} password - The password of the user
   * @param {string} profilePicture - The profile picture of the user
   *
   * @returns {void} The result of this function
   */
  const handleRegister = async (
    name: string,
    email: string,
    password: string,
    profilePicture: string
  ): Promise<void> => {
    {
      setIsLoding(true);
      register(name, email, password, profilePicture);
      setIsLoding(false);
    }
  };

  const pickImage = async (
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
  ) => {
    try {
      const cameraResp = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
      });

      if (!cameraResp.canceled) {
        const { uri } = cameraResp.assets[0];

        setFieldValue("profilePicture", uri);
        setProfileImage(uri);
      }
    } catch (error) {
      alert("Unable to pick an image");
      throw new Error("Image picker error");
    }
  };

  return (
    <Formik
      initialValues={{
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        profilePicture: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values) =>
        handleRegister(
          values.name,
          values.email,
          values.password,
          values.profilePicture
        )
      }
    >
      {({
        handleChange,
        handleSubmit,
        setFieldValue,
        values,
        errors,
        touched,
      }) => (
        <KeyboardAvoidingView
          keyboardVerticalOffset={keyboardVerticalOffset}
          style={[
            styles.container,
            { backgroundColor: currentColors.mainBackground },
          ]}
          behavior="padding"
        >
          <Text style={[styles.subTitle, { color: currentColors.gray }]}>
            WhatsApp will need to verify your account.
          </Text>

          <View style={styles.list}>
            <TextInput
              returnKeyType="done"
              keyboardType="default"
              placeholder="Please enter your name"
              onChangeText={handleChange("name")}
              value={values.name}
              style={styles.input}
            />
          </View>
          {!!(errors.name && touched.name) && (
            <Text style={styles.erroText}>{errors.name}</Text>
          )}

          <View style={styles.list}>
            <TextInput
              returnKeyType="done"
              keyboardType="email-address"
              placeholder="Please enter your email address"
              onChangeText={handleChange("email")}
              value={values.email}
              style={styles.input}
            />
          </View>
          {!!(errors.email && touched.email) && (
            <Text style={styles.erroText}>{errors.email}</Text>
          )}

          <View style={styles.list}>
            <TextInput
              returnKeyType="done"
              secureTextEntry
              placeholder="Please enter your password"
              onChangeText={handleChange("password")}
              value={values.password}
              style={styles.input}
            />
          </View>
          {!!(errors.password && touched.password) && (
            <Text style={styles.erroText}>{errors.password}</Text>
          )}

          <View style={styles.list}>
            <TextInput
              returnKeyType="done"
              secureTextEntry
              placeholder="Please enter your password again"
              onChangeText={handleChange("confirmPassword")}
              value={values.confirmPassword}
              style={styles.input}
            />
          </View>
          {!!(errors.confirmPassword && touched.confirmPassword) && (
            <Text style={styles.erroText}>{errors.confirmPassword}</Text>
          )}

          <TouchableOpacity onPress={() => pickImage(setFieldValue)}>
            <Text style={styles.pickImageText}>Pick a profile picture</Text>
          </TouchableOpacity>
          {profileImage && (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          )}

          <View style={{ flex: 1 }} />

          <TouchableOpacity
            style={[
              styles.signInButton,
              values.email === "" ||
              values.password === "" ||
              values.name === "" ||
              values.confirmPassword === ""
                ? { backgroundColor: currentColors.lightGray }
                : { backgroundColor: currentColors.primary },
            ]}
            onPress={() => handleSubmit()}
          >
            <Text style={styles.signInText}>Register</Text>
          </TouchableOpacity>
          <Link href={"/(auth)/login"} style={styles.register}>
            <Text style={{ color: currentColors.gray }}>
              Already have an account?{" "}
              <Text style={{ color: currentColors.primary }}>Login!</Text>
            </Text>
          </Link>
        </KeyboardAvoidingView>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    gap: 20,
  },
  title: {
    color: "black",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 35,
  },
  subTitle: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },
  input: {
    width: "100%",
    fontSize: 16,
    padding: 5,
    marginTop: 10,
  },
  signInButton: {
    width: "100%",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
  },
  signInText: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
  },
  list: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 10,
    padding: 10,
  },
  erroText: {
    color: "red",
    alignSelf: "flex-start",
    marginTop: -10,
    fontSize: 12,
  },
  register: {
    color: "blue",
    fontSize: 14,
    textAlign: "right",
    marginBottom: 50,
  },
  pickImageText: {
    color: "blue",
    fontSize: 16,
    textAlign: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
  },
});

export default Register;
