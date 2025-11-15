import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import { Button } from '@/components/ui/Button';

import type { TodoFormValues } from './TodoForm';

export interface AddTaskModalProps {
  mode: 'create' | 'edit';
  initialValues?: TodoFormValues;
  onSubmit: (values: TodoFormValues) => Promise<void> | void;
  onClose: () => void;
}

// Simple popup for creating and editing a task.
// It collects title, description, date, and category,
// and delegates the actual creation and authentication to the parent.

export function AddTaskModal({ mode, initialValues, onSubmit, onClose }: AddTaskModalProps) {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [deadlineDate, setDeadlineDate] = useState(initialValues?.deadlineDate ?? '');
  const [category, setCategory] = useState(initialValues?.category ?? '');
  const [isCompleted, setIsCompleted] = useState<boolean>(Boolean(initialValues?.isCompleted));
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [dateValue, setDateValue] = useState<Date | null>(null);

  // Keep local form state in sync when editing a different task.
  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title ?? '');
      setDescription(initialValues.description ?? '');
      setDeadlineDate(initialValues.deadlineDate ?? '');
      setCategory(initialValues.category ?? '');
      setIsCompleted(Boolean(initialValues.isCompleted));
    } else {
      setTitle('');
      setDescription('');
      setDeadlineDate('');
      setCategory('');
      setIsCompleted(false);
    }
  }, [initialValues, mode]);

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }

    await onSubmit({
      title: trimmedTitle,
      description: description.trim() || undefined,
      deadlineDate: deadlineDate.trim() || undefined,
      category: category.trim() || undefined,
      isCompleted,
    });

    // Reset local state after submit. The parent will close the popup.
    setTitle('');
    setDescription('');
    setDeadlineDate('');
    setCategory('');
    onClose();
  };

  const handleOpenDatePicker = () => {
    // Toggle the date picker, and close the category dropdown if open.
    setIsDatePickerOpen((open) => !open);
    setIsCategoryOpen(false);
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === 'dismissed') {
      // Close the picker when the user cancels.
      setIsDatePickerOpen(false);
      return;
    }

    // When the user selects a date, store and format it.
    const currentDate = selectedDate ?? dateValue ?? new Date();
    setDateValue(currentDate);
    setDeadlineDate(formatDate(currentDate));

    // On Android, the native picker has explicit confirm/cancel buttons,
    // so we can safely close after selection. On iOS we keep it open so
    // users can scroll the spinner without it disappearing.
    if (Platform.OS === 'android') {
      setIsDatePickerOpen(false);
    }
  };

  const buttonLabel = mode === 'edit' ? 'Save' : 'Add';

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.overlay}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.title}>{mode === 'edit' ? 'Edit Task' : 'New Task'}</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Text style={styles.closeIcon}>×</Text>
            </Pressable>
          </View>
          <View style={styles.form}>
            <TextInput
              placeholder="Title"
              placeholderTextColor="#9ca3af"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />
            <TextInput
              placeholder="Description"
              placeholderTextColor="#9ca3af"
              value={description}
              onChangeText={setDescription}
              style={[styles.input, styles.multilineInput]}
              multiline
            />
            <Pressable
              style={[styles.input, styles.dropdownTrigger]}
              onPress={handleOpenDatePicker}>
              <Text style={deadlineDate ? styles.dropdownValue : styles.dropdownPlaceholder}>
                {deadlineDate || 'Select date'}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.input, styles.dropdownTrigger]}
              onPress={() => setIsCategoryOpen((open) => !open)}>
              <Text style={category ? styles.dropdownValue : styles.dropdownPlaceholder}>
                {category || 'Select category'}
              </Text>
            </Pressable>
            {mode === 'edit' && (
              <Pressable
                style={styles.completedRow}
                onPress={() => setIsCompleted((prev) => !prev)}>
                <View style={[styles.completedCheckbox, isCompleted && styles.completedCheckboxChecked]}>
                  {isCompleted && <Text style={styles.completedCheckboxMark}>✓</Text>}
                </View>
                <Text style={styles.completedLabel}>Mark as completed</Text>
              </Pressable>
            )}
            {isCategoryOpen && (
              <View style={styles.dropdownMenu}>
                {['Work', 'Personal', 'Shopping', 'Others'].map((option) => (
                  <Pressable
                    key={option}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setCategory(option);
                      setIsCategoryOpen(false);
                    }}>
                    <Text style={styles.dropdownItemLabel}>{option}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
          <Button
            label={buttonLabel}
            onPress={handleSubmit}
            style={styles.submitButton}
            labelStyle={{ color: '#ffffff' }}
            // Always active as requested (no disabled state).
          />

          {isDatePickerOpen && (
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerHeader}>
                <Text style={styles.datePickerLabel}>Select date</Text>
                <Pressable
                  onPress={() => {
                    if (!deadlineDate) {
                      const base = dateValue ?? new Date();
                      setDateValue(base);
                      setDeadlineDate(formatDate(base));
                    }
                    setIsDatePickerOpen(false);
                  }}
                  hitSlop={8}>
                  <Text style={styles.datePickerDone}>Done</Text>
                </Pressable>
              </View>
              <DateTimePicker
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                value={dateValue ?? new Date()}
                onChange={handleDateChange}
                themeVariant="light"
                minimumDate={new Date()}
              />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const CARD_RADIUS = 20;

function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'stretch',
    justifyContent: 'flex-end',
    paddingBottom: 0,
    // Slight dim behind the popup so its border stands out.
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: CARD_RADIUS,
    borderTopRightRadius: CARD_RADIUS,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 0,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  closeIcon: {
    fontSize: 20,
    color: '#6b7280',
    paddingLeft: 8,
  },
  form: {
    gap: 10,
    marginBottom: 16,
  },
  input: {
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e1e1e1',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    // Full-width primary button attached to the bottom of the popup.
    backgroundColor: '#6362F9',
    borderRadius: 0,
    alignSelf: 'stretch',
    marginHorizontal: -20,
    paddingVertical: 14,
  },
  dropdownTrigger: {
    justifyContent: 'center',
  },
  dropdownPlaceholder: {
    color: '#9ca3af',
  },
  dropdownValue: {
    color: '#111827',
  },
  dropdownMenu: {
    marginTop: 4,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dropdownItemLabel: {
    fontSize: 14,
    color: '#111827',
  },
  completedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  completedCheckbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedCheckboxChecked: {
    backgroundColor: '#6362F9',
    borderColor: '#6362F9',
  },
  completedCheckboxMark: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  completedLabel: {
    fontSize: 13,
    color: '#4b5563',
  },
  datePickerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f3f4f6',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  datePickerLabel: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 8,
  },
  datePickerDone: {
    fontSize: 14,
    color: '#6362F9',
    fontWeight: '600',
  },
});


