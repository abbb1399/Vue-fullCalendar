<template>
  <div class="hello">
    <FullCalendar :options="calendarOptions" ref="fullCalendar"/>
   <div>
  <!-- <b-button v-b-modal.modal-1>Launch demo modal</b-button> -->

  <b-modal id="modal-1" 
    v-model="showModal" 
    title="일별 출근 상황"
    hide-footer  
    title-class="text-black font-18"
    body-class="p-3"
    size="xl"
   >
      <b-container fluid>
      <!-- User Interface controls -->
      <b-row>
        <b-col lg="6" class="my-1">
          <b-form-group
            label="분류"
            label-for="sort-by-select"
            label-cols-sm="3"
            label-align-sm="right"
            label-size="sm"
            class="mb-0"
            v-slot="{ ariaDescribedby }"
          >
            <b-input-group size="sm">
              <b-form-select
                id="sort-by-select"
                v-model="sortBy"
                :options="sortOptions"
                :aria-describedby="ariaDescribedby"
                class="w-75"
              >
                <template #first>
                  <option value="">-- none --</option>
                </template>
              </b-form-select>

              <b-form-select
                v-model="sortDesc"
                :disabled="!sortBy"
                :aria-describedby="ariaDescribedby"
                size="sm"
                class="w-25"
              >
                <option :value="false">Asc</option>
                <option :value="true">Desc</option>
              </b-form-select>
            </b-input-group>
          </b-form-group>
        </b-col>

        <b-col lg="6" class="my-1">
          <b-form-group
            label="Initial sort"
            label-for="initial-sort-select"
            label-cols-sm="3"
            label-align-sm="right"
            label-size="sm"
            class="mb-0"
          >
            <b-form-select
              id="initial-sort-select"
              v-model="sortDirection"
              :options="['asc', 'desc', 'last']"
              size="sm"
            ></b-form-select>
          </b-form-group>
        </b-col>

        <b-col lg="6" class="my-1">
          <b-form-group
            label="검색"
            label-for="filter-input"
            label-cols-sm="3"
            label-align-sm="right"
            label-size="sm"
            class="mb-0"
          >
            <b-input-group size="sm">
              <b-form-input
                id="filter-input"
                v-model="filter"
                type="search"
                placeholder="Type to Search"
              ></b-form-input>

              <b-input-group-append>
                <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>

        <b-col lg="6" class="my-1">
          <b-form-group
            v-model="sortDirection"
            label="필터"
            description="Leave all unchecked to filter on all data"
            label-cols-sm="3"
            label-align-sm="right"
            label-size="sm"
            class="mb-0"
            v-slot="{ ariaDescribedby }"
          >
            <b-form-checkbox-group
              v-model="filterOn"
              :aria-describedby="ariaDescribedby"
              class="mt-1"
            >
              <b-form-checkbox value="name">이름</b-form-checkbox>
              <b-form-checkbox value="age">나이</b-form-checkbox>
              <b-form-checkbox value="isActive">출근</b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group>
        </b-col>

        <b-col sm="5" md="6" class="my-1">
          <b-form-group
            label="페이지 수"
            label-for="per-page-select"
            label-cols-sm="6"
            label-cols-md="4"
            label-cols-lg="3"
            label-align-sm="right"
            label-size="sm"
            class="mb-0"
          >
            <b-form-select
              id="per-page-select"
              v-model="perPage"
              :options="pageOptions"
              size="sm"
            ></b-form-select>
          </b-form-group>
        </b-col>
      </b-row>

      <!-- Main table element -->
      <b-table
        :items="items"
        :fields="fields"
        :current-page="currentPage"
        :per-page="perPage"
        :filter="filter"
        :filter-included-fields="filterOn"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :sort-direction="sortDirection"
        stacked="md"
        show-empty
        small
        @filtered="onFiltered"
      >
        <template #cell(name)="row">
          {{ row.value.first }} {{ row.value.last }}
        </template>

        <template #cell(actions)="row">
          <b-button size="sm" @click="info(row.item, row.index, $event.target)" class="mr-1">
            Info modal
          </b-button>
          <b-button size="sm" @click="row.toggleDetails">
            {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
          </b-button>
        </template>

        <template #row-details="row">
          <b-card>
            <ul>
              <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
            </ul>
          </b-card>
        </template>
      </b-table>

      <!-- Info modal -->
      <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
        <pre>{{ infoModal.content }}</pre>
      </b-modal>
      <b-row>
        <b-col sm="6" md="6" class="my-1">
          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            align="fill"
            size="sm"
            class="my-0"
          ></b-pagination>
        </b-col>
      </b-row>
    </b-container>
  </b-modal>

  <!-- <b-modal v-model="showModal">Hello From Modal!</b-modal>  -->
</div>
  
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import moment from "moment"

import koLocale from "@fullcalendar/core/locales/ko"
import bootstrapPlugin from '@fullcalendar/bootstrap';

import { calendarEvents, categories } from "./data-calendar";

export default {
  components: {
    FullCalendar // make the <FullCalendar> tag available
  },
  data() {
    return {
      items: [
        { isActive: true, age: 40, name: { first: 'Dickerson', last: 'Macdonald' }, in:"2021-01-13 오전 9:46", out:"2021-01-13 오전 9:46" },
        { isActive: false, age: 21, name: { first: 'Larsen', last: 'Shaw' }, in:"2021-01-13 오전 9:46", out:"2021-01-13 오전 9:46" },
        {
          isActive: false,
          age: 9,
          name: { first: 'Mini', last: 'Navarro' },
          in:"2021-01-13 오전 9:46", out:"2021-01-13 오전 9:46"
        },
        { isActive: false, age: 89, name: { first: 'Geneva', last: 'Wilson' }, in:"2021-01-13 오전 9:46", out:"2021-01-13 오전 9:46" },
        { isActive: true, age: 38, name: { first: 'Jami', last: 'Carney' }, in:"2021-01-13 오전 9:46", out:"2021-01-13 오전 9:46" },
        { isActive: false, age: 27, name: { first: 'Essie', last: 'Dunlap' }, in:"2021-01-13 오전 9:46", out:"2021-01-13 오전 9:46" },
        { isActive: true, age: 40, name: { first: 'Thor', last: 'Macdonald' }, in:"2021-01-13 오전 9:46", out:"2021-01-13 오전 9:46" },
        {
          isActive: true,
          age: 87,
          name: { first: 'Larsen', last: 'Shaw' },
          _cellVariants: { age: 'danger', isActive: 'warning' },
          in:"2021-01-13 오전 9:46", out:"2021-01-13 오전 9:46"
        },
        { isActive: false, age: 26, name: { first: 'Mitzi', last: 'Navarro' },in:"2021-01-13 오전 9:46", out:"2021-01-13 오전 9:46" },
        { isActive: false, age: 22, name: { first: 'Genevieve', last: 'Wilson' },in:"2021-01-13 오전 9:46", out:"2021-01-13 오전 9:46" },
        { isActive: true, age: 38, name: { first: 'John', last: 'Carney' },in:"2021-01-13 오전 9:46", out:"2021-01-13 오전 9:46" },
        { isActive: false, age: 29, name: { first: 'Dick', last: 'Dunlap' },in:"2021-01-13 오전 9:46", out:"2021-01-13 오전 9:46" }
      ],
      fields: [
        { key: 'name', label: '이름', sortable: true, sortDirection: 'desc' },
        { key: 'age', label: '나이', sortable: true, class: 'text-center' },
        {
          key: 'isActive',
          label: '출근',
          formatter: (value, key, item) => {
            console.log(key,item)
            return value ? 'Yes' : 'No'
          },
          sortable: true,
          sortByFormatted: true,
          filterByFormatted: true
        },
        { key: 'actions', label: 'Actions' },
        { key: 'in', label:"출근"},
        { key: 'out', label:"퇴근"}
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      filterOn: [],
      infoModal: {
        id: 'info-modal',
        title: '',
        content: ''
      },
      //// table 끝 /////



      calendarEvents: calendarEvents,
      calendarOptions: {
        locale: koLocale,
        plugins: [ dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin, bootstrapPlugin  ],
        initialView: 'dayGridMonth',
        themeSystem: "bootstrap",
        dateClick: this.dateClicked,
        events: [ //잘모르겟다..
          { title: 'event 1', date: '2020-01-15' }, 
          { title: 'event 2', date: '2019-01-16' }
        ],
        customButtons: {
          myCustomButton: {
            text: 'custom!',
             click:() => {
              var dateStr = prompt('Enter a date in YYYY-MM-DD format');
              var date = moment(dateStr);

              if (date.isValid()) { 

                console.log(this.$refs.fullCalendar)
                console.log(this.$refs.fullCalendar.getApi())
                const ttt = this.$refs.fullCalendar.getApi()
                // calendarEvents.push({
                //   id: 50,
                //   title: '냐하하',
                //   start: new Date(),
                //   end: new Date(),
                //   className: 'bg-success text-white',
                // }) 
                ttt.addEvent({
                  id: 55,
                  title: '냐하하',
                  start: new Date(),
                  end: new Date(),
                  allDay: true
                })
                alert('Great. Now, update your database...');
                // this.$nextTick(() => ttt.render())
              } else { 
                alert('Invalid date.');
              }
            }
          }
        },
        headerToolbar: {
          left: "prev,next today myCustomButton",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        },
        categories: categories,
        initialEvents: calendarEvents,
        dayMaxEvents: true
      },

      submitted : false,
      showModal : false,
      newEventData: {},
      event: {
        title: "",
        category: "",
      },
    }
  },
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key }
        })
    }
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.items.length
  },
  methods: {
    info(item, index, button) {
      this.infoModal.title = `Row index: ${index}`
      this.infoModal.content = JSON.stringify(item, null, 2)
      this.$root.$emit('bv::show::modal', this.infoModal.id, button)
    },
    resetInfoModal() {
      this.infoModal.title = ''
      this.infoModal.content = ''
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    handleDateClick: function(arg) {
      alert('date click! ' + arg.dateStr)
    },
    dateClicked(info) {
      this.newEventData = info;
      this.showModal = true;
    },

    hideModal() {
      this.submitted = false;
      this.showModal = false;
      this.event = {};
    },
    handleSubmit(){
      alert("clicked");
      



    }


  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
