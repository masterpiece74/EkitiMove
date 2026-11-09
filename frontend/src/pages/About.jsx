function About() {
  return (
    <main className="min-h-screen bg-gray-50">

      {/* Header */}
      <section className="bg-green-600 px-6 py-16 text-white">
        <div className="max-w-5xl mx-auto text-center">

          <h1 className="text-4xl md:text-5xl font-bold">
            About EkitiMove
          </h1>

          <p className="mt-4 text-green-50 text-lg max-w-2xl mx-auto">
            Making transportation around Ekiti State simpler,
            easier, and more connected.
          </p>

        </div>
      </section>

      {/* About EkitiMove */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">

          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              What is EkitiMove?
            </h2>

            <p className="mt-5 text-gray-600 leading-relaxed">
              EkitiMove is a transportation platform designed to
              help people move around Ekiti State with ease.
              It helps users discover routes, destinations,
              transport options, and estimated fares.
            </p>

            <p className="mt-4 text-gray-600 leading-relaxed">
              From travelling between towns to finding places
              within a town, EkitiMove aims to make transportation
              information easier to access.
            </p>

          </div>

        </div>
      </section>

      {/* Our Vision */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="text-4xl">
              
            </div>

            <h2 className="mt-5 text-2xl font-bold text-gray-900">
              Our Vision
            </h2>

            <p className="mt-3 text-gray-600 leading-relaxed">
              To make transportation information accessible
              to everyone travelling within Ekiti State.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="text-4xl">
              
            </div>

            <h2 className="mt-5 text-2xl font-bold text-gray-900">
              Our Goal
            </h2>

            <p className="mt-3 text-gray-600 leading-relaxed">
              To connect passengers, drivers, and riders while
              providing useful route and fare information.
            </p>
          </div>

        </div>
      </section>

    </main>
  );
}

export default About;