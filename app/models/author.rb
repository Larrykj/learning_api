# app/models/author.rb
class Author < ApplicationRecord
  has_many :books
end

# app/models/book.rb
class Book < ApplicationRecord
  belongs_to :author
end
