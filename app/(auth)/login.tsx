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
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import AuthService from "@/services/authService";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";


const Login = () => {
  const {signIn} = AuthService();
  const [isLoding, setIsLoding] = useState(false);
  const keyboardVerticalOffset = Platform.OS === "ios" ? 90 : 0;
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];

  /**
   * This is the validation schema for the login form
   *
   * @param {string} email - The email of the user
   * @param {string} password - The password of the user
   *
   * @returns {object} - The validation schema for the login form
   */
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password is too short"),
  });

  /**
   * This function is used to sign in a user
   *
   * @param {string} email - The email of the user
   * @param {string} password - The password of the user
   *
   * @returns {void} The result of this function
   */
  const handleLogin = async (email: string, password: string): Promise<void> => {
    {
      setIsLoding(true);
      signIn(email, password);
      setIsLoding(false);
    }
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={(values) => handleLogin(values.email, values.password)}
    >
      {({ handleChange, handleSubmit, values, errors, touched }) => (
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

          <View style={{ flex: 1 }} />

          <TouchableOpacity
            style={[
              styles.signInButton,
              values.email === "" || values.password === ""
                ? { backgroundColor: currentColors.lightGray }
                : { backgroundColor: currentColors.primary },
            ]}
            onPress={() => handleSubmit()}
          >
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
          <Link href={"/(auth)/register"} style={styles.register}>
            <Text style={{ color: currentColors.gray }}>
              Not a member?{" "}
              <Text style={{ color: currentColors.primary }}>Register!</Text>
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
});

export default Login;
