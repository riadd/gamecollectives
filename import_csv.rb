require 'csv'

filename = ARGV[0]

def parse_url(url)
  url && url.start_with?("http") ? url : "http://#{url}"
end

CSV.foreach(filename, :encoding => 'utf-8').each do |row|
  homepage = parse_url(row[1])
  location = row[2]
  coworking = row[3] == "Yes"
  twitter = row[4]
  facebook = row[5]
  instagram = row[6]
  email = row[7]
  established = row[8]

  puts("- name: ???")
  puts("  homepage: #{homepage}")
  puts("  address: #{location}")
  puts("  coworking: #{coworking}")
  puts("  established: #{established}") if established.length > 0
  puts("  twitter: #{twitter}") if twitter.length > 0
  puts("  facebook: #{facebook}") if facebook.length > 0
  puts("  instagram: #{instagram}") if instagram.length > 0
  puts("  email: #{email}") if email.length > 0
  puts
end