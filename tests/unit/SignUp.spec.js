// Libraries
import Vue from 'vue';
import Vuetify from 'vuetify';
import VueRouter from 'vue-router';
import Vuex from 'vuex';

// Components
import SignUp from '@/views/Authentication/SignUp.vue';

// Utilities
import { mount, createLocalVue } from '@vue/test-utils';

/**
 * @todo[XL3]: Add an alias resolver to Jest
 *   because it fails to resolve the 'api-client' alias
 */

Vue.use(Vuetify);

const localVue = createLocalVue();
localVue.use(Vuetify);
localVue.use(VueRouter);
localVue.use(Vuex);

const vuetify = new Vuetify();
const router = new VueRouter();
const store = new Vuex.Store({
  state: {
    currentUser: {},
  },
  mutations: {
    setCurrentUser() {},
  },
});

describe('SignUp.vue', () => {
  test('All data fields are clear on mount', () => {
    // Mount the component
    const wrapper = mount(SignUp, {
      store,
      localVue,
      vuetify,
      router,
    });

    const input = wrapper.vm.$data.userInput;

    expect(input.email).toEqual('');
    expect(input.confirmEmail).toEqual('');
    expect(input.password).toEqual('');
    expect(input.name).toEqual('');
    expect(input.dob.day).toEqual('');
    expect(input.dob.month).toEqual('');
    expect(input.dob.year).toEqual('');
    expect(input.gender).toEqual('');
    expect(input.onLogin).toEqual(false);
    expect(input.incorrect).toEqual(false);
  });

  test('All page components are loaded', () => {
    // Mount the component
    const wrapper = mount(SignUp, { localVue, vuetify, router });

    expect(wrapper.find('#logo').exists()).toEqual(true);
    // expect(wrapper.find('#errorBar').exists()).toEqual(true);
    expect(wrapper.find('#emailField').exists()).toEqual(true);
    expect(wrapper.find('#confirmEmailField').exists()).toEqual(true);
    expect(wrapper.find('#passwordField').exists()).toEqual(true);
    expect(wrapper.find('#nameField').exists()).toEqual(true);

    expect(wrapper.find('#dobDayField').exists()).toEqual(true);
    expect(wrapper.find('#dobMonthSelect').exists()).toEqual(true);
    expect(wrapper.find('#dobYearField').exists()).toEqual(true);

    expect(wrapper.find('#genderRadio').exists()).toEqual(true);

    expect(wrapper.find('#signupBtn').exists()).toEqual(true);
    expect(wrapper.find('#loginPrompt').exists()).toEqual(true);
  });

  test('Signing up as an existing user fails', async () => {
    // Mount the component
    const wrapper = mount(SignUp, {
      store,
      localVue,
      vuetify,
      router,
    });

    // Assert that the button exists
    const signupBtn = wrapper.find('#signupBtn');
    expect(signupBtn.exists()).toEqual(true);

    // Assert that all input fields exist
    const emailField = wrapper.find('#emailField');
    expect(emailField.exists()).toEqual(true);
    const passwordField = wrapper.find('#passwordField');
    expect(passwordField.exists()).toEqual(true);
    const confirmEmailField = wrapper.find('#confirmEmailField');
    expect(confirmEmailField.exists()).toEqual(true);
    const nameField = wrapper.find('#nameField');
    expect(nameField.exists()).toEqual(true);

    const dobDayField = wrapper.find('#dobDayField');
    expect(dobDayField.exists()).toEqual(true);
    const dobMonthSelect = wrapper.find('#dobMonthSelect');
    expect(dobMonthSelect.exists()).toEqual(true);
    const dobYearField = wrapper.find('#dobYearField');
    expect(dobYearField.exists()).toEqual(true);

    const genderRadio = wrapper.find('#genderRadio');
    expect(genderRadio.exists()).toEqual(true);

    // Set the existing data
    emailField.setValue('admin@admin.com');
    passwordField.setValue('admin:admin');
    confirmEmailField.setValue('admin@admin.com');
    nameField.setValue('Admin');

    dobDayField.setValue('1');
    dobMonthSelect.setValue('January');
    dobYearField.setValue('1991');

    // Click the button and wait
    signupBtn.trigger('click');
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve('done');
      }, 50);
    });
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.$data.userInput.incorrect).toEqual(true);
    expect(wrapper.find('#errorBar').exists()).toEqual(true);
  });

  test('Signing up as a new user succeeds', async () => {
    // Mount the component
    const wrapper = mount(SignUp, {
      store,
      localVue,
      vuetify,
      router,
    });

    // Assert that the button exists
    const signupBtn = wrapper.find('#signupBtn');
    expect(signupBtn.exists()).toEqual(true);

    // Assert that all input fields exist
    const emailField = wrapper.find('#emailField');
    expect(emailField.exists()).toEqual(true);
    const passwordField = wrapper.find('#passwordField');
    expect(passwordField.exists()).toEqual(true);
    const confirmEmailField = wrapper.find('#confirmEmailField');
    expect(confirmEmailField.exists()).toEqual(true);
    const nameField = wrapper.find('#nameField');
    expect(nameField.exists()).toEqual(true);

    const dobDayField = wrapper.find('#dobDayField');
    expect(dobDayField.exists()).toEqual(true);
    const dobMonthSelect = wrapper.find('#dobMonthSelect');
    expect(dobMonthSelect.exists()).toEqual(true);
    const dobYearField = wrapper.find('#dobYearField');
    expect(dobYearField.exists()).toEqual(true);

    const genderRadio = wrapper.find('#genderRadio');
    expect(genderRadio.exists()).toEqual(true);

    // Set the new data
    emailField.setValue('newAdmin@newAdmin.com');
    passwordField.setValue('newAdmin:newAdmin');
    confirmEmailField.setValue('newAdmin@newAdmin.com');
    nameField.setValue('New Admin');

    dobDayField.setValue('1');
    dobMonthSelect.setValue('January');
    dobYearField.setValue('1991');

    // Click the button and wait
    signupBtn.trigger('click');
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve('done');
      }, 50);
    });
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.$data.userInput.incorrect).toEqual(false);
  });
});
