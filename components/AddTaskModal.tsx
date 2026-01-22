import React, { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { Colors } from "../constants/Colors";
import { Todo } from "../types/todo";

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (title: string, description: string) => void;
  editingTodo?: Todo | null;
}

export default function AddTaskModal({
  visible,
  onClose,
  onSave,
  editingTodo,
}: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title);
      setDescription(editingTodo.description);
    } else {
      setTitle("");
      setDescription("");
    }
  }, [editingTodo, visible]);

  const handleDone = () => {
    if (title.trim()) {
      onSave(title.trim(), description.trim());
      setTitle("");
      setDescription("");
      onClose();
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <View style={styles.header}>
                  <Text style={styles.headerTitle}>
                    {editingTodo ? "Edit Task" : "Add New Task"}
                  </Text>
                  <TouchableOpacity onPress={handleClose}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>

                <TextInput
                  style={styles.input}
                  placeholder="Task Title"
                  value={title}
                  onChangeText={setTitle}
                  placeholderTextColor={Colors.textSecondary}
                  autoFocus
                />

                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Description (Optional)"
                  value={description}
                  onChangeText={setDescription}
                  placeholderTextColor={Colors.textSecondary}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />

                <TouchableOpacity
                  style={[
                    styles.doneButton,
                    !title.trim() && styles.doneButtonDisabled,
                  ]}
                  onPress={handleDone}
                  disabled={!title.trim()}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
  },
  cancelText: {
    fontSize: 16,
    color: Colors.primary,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    color: Colors.text,
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  doneButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  doneButtonDisabled: {
    backgroundColor: Colors.border,
  },
  doneButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
