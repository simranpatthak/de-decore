
const Home = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16">
        <div className="md:w-1/2 space-y-4">
          <h1 className="text-4xl font-bold">
            Start Finding & Posting Jobs Through <span className="text-green-500">Our App</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore job roles & advertise your manpower requirements
          </p>
          <button className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600">
            Coming Soon
          </button>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
          <img src="/images/app-preview.png" alt="App Preview" className="w-3/4" />
        </div>
      </section>

      {/* Job Categories */}
      <section className="text-center py-12">
        <h2 className="text-2xl font-bold">Top Categories</h2>
        <p className="text-gray-600 dark:text-gray-400">We have more than 500+ categories</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 px-6 md:px-20">
          {[
            { title: "Plumber", jobs: 756 },
            { title: "Electrician", jobs: 140 },
            { title: "Carpenter", jobs: 325 },
            { title: "Cleaning Staff", jobs: 436 },
          ].map((category, index) => (
            <div key={index} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-green-500">{category.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{category.jobs} jobs available</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-200 dark:bg-gray-800 text-center">
        <h2 className="text-2xl font-bold">Start finding jobs or posting them today!</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 px-6 md:px-20">
          {[
            { title: "Different types of services", desc: "Automation of renewals and payments" },
            { title: "Available at your place", desc: "Work from anywhere easily" },
            { title: "Trusted by users", desc: "Verified employers and job seekers" },
          ].map((feature, index) => (
            <div key={index} className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-green-500">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-6 md:px-20 text-center md:text-left">
        <div className="md:flex md:justify-between">
          <div>
            <h3 className="text-2xl font-bold">TRADE HUNTERS</h3>
            <p className="text-gray-400">&copy; 2024 Trade Hunters. All rights reserved.</p>
          </div>
          <div>
            <h4 className="font-semibold">Contact Us</h4>
            <p className="text-gray-400">admin@tradehunters.com.au</p>
          </div>
          <div>
            <h4 className="font-semibold">Address</h4>
            <p className="text-gray-400">123 City, XYZ State, Lorem Ipsum</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
